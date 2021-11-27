const { red } = require('chalk');
const { existsSync } = require('fs');
const logger = require('../../utils/logger');
const { join } = require('path');
const { configFileName, templatesDirName, tplDirPath } = require('../../constants');

module.exports = class UserConfigValidator {

  constructor(userSettigns, entityName) {
    this.userSettigns = userSettigns;
    this.entityName = entityName;
  }

  validate() {
    this.tplDirPathShouldExist();
    this.rootIsAString();
    this.entitiesValueIsANonEmptyArray();
    this.entityIsRegistered();
    this.entityAliasesAreArraysOfStrings();
    this.entityNamesAndAliasesAreNotAmbiguous();
    this.entityNamesAreStrings();
    this.templateFilesAreRegistered();
    this.tplIsAString();
    this.tplNameIsAString();
    this.templateFilesExist();
    this.newDirPropertyIsOfBooleanType();
    this.fileNameIsAFunctionWhichReturnsAString();
  }

  tplDirPathShouldExist() {
    if (!tplDirPath) {
      logger.error(red(
        `${templatesDirName} could not be found. \n\nYou either haven't initialized blueprinter (do it with 'bpr init')\nor running bpr command outside of your project.`));
      process.exit(1);
    }
  }

  entitiesValueIsANonEmptyArray() {
    if (!Array.isArray(this.userSettigns.entities)) {
      this.validationError('The value assigned to the entities property should be of a type Array.');
    }

    if (this.userSettigns.entities.length === 0) {
      this.validationError('The array of entities should not be empty.');
    }
  }

  rootIsAString() {
    if (typeof this.userSettigns.root !== 'string') {
      this.validationError('The value assigned to the root property should be of a type String.');
    }
  }

  entityIsRegistered() {
    const entityConfig = this.userSettigns.entities.find(
      e => e.name === this.entityName || e.aliases.includes(this.entityName));

    if (!entityConfig) {
      this.validationError(`Entity "${this.entityName}" is not registered in the ${configFileName}`);
    }
  }

  entityAliasesAreArraysOfStrings() {
    const aliasesAreArraysOfStrings = this.userSettigns.entities.every(e =>
      e.aliases === undefined || Array.isArray(e.aliases) && e.aliases.every(a => typeof a === 'string'));

    if (!aliasesAreArraysOfStrings) {
      this.validationError('Value of the property "aliases" should be of type Array<string> or undefined.');
    }
  }

  entityNamesAndAliasesAreNotAmbiguous() {
    const names = this.userSettigns.entities.map(e =>
      e.aliases && e.aliases.length ? e.aliases.concat(e.name) : [e.name]);

    const unique = [];
    for (let i = 0; i < names.length; i++) {
      const entityNames = names[i];
      for (let j = 0; j < entityNames.length; j++) {
        if (!unique.includes(entityNames[j])) {
          unique.push(entityNames[j]);
        } else {
          this.validationError(`Entity name/alias ${entityNames[j]} is ambiguous.`);
          break;
        }
      }
    }
  }

  templateFilesAreRegistered() {
    const filesAreRegistered = this.userSettigns.entities.every(e => Array.isArray(e.files) && e.files.length >= 1);

    if (!filesAreRegistered) {
      this.validationError('"files" is a mandatory property of each Entity object.');
    }
  }

  tplIsAString() {
    const tplsAreStrings = this.concatEntityFiles()
                               .every(f => f.tpl === undefined || typeof f.tpl === 'string');

    if (!tplsAreStrings) {
      this.validationError('"files[].tpl" should be of type string or undefined');
    }
  }

  tplNameIsAString() {
    const tplNamesAreStrings = this.concatEntityFiles()
                                   .every(f => f.tplName === undefined || typeof f.tplName === 'string');

    if (!tplNamesAreStrings) {
      this.validationError('"files[].tplName" should be of type string or undefined');
    }
  }

  templateFilesExist() {
    const tplFilesWhichNotExist = this.userSettigns.entities
                                      .map(e => e.files.filter(f => f.tplName))
                                      .reduce((acc, next) => acc.concat(next))
                                      .map(f => f.tplName)
                                      .filter(tplName => !existsSync(join(tplDirPath, tplName)));

    if (tplFilesWhichNotExist.length) {
      this.validationError(`Templates "${tplFilesWhichNotExist.join('", "')}" could not be found in ${templatesDirName} directory.`);
    }
  }

  entityNamesAreStrings() {
    const someNamesAreNotStrings = this.userSettigns.entities
                                       .map(e => e.name)
                                       .some(name => typeof name !== 'string');

    if (someNamesAreNotStrings) {
      this.validationError(`Entity names must be strings`);
    }
  }

  newDirPropertyIsOfBooleanType() {
    const someNewDirPropertiesAreNotOfBooleanType = this.userSettigns.entities.some(
      e => e.newDir !== undefined && typeof e.newDir !== 'boolean');

    if (someNewDirPropertiesAreNotOfBooleanType) {
      this.validationError('Value of the property "newDir" should be of a boolean type or undefined');
    }
  }

  fileNameIsAFunctionWhichReturnsAString() {
    const fileNamesAreFunctionsWhichReturnAString = this.concatEntityFiles()
                                                        .every(f => typeof f.name === 'function' && typeof f.name() === 'string');

    if (!fileNamesAreFunctionsWhichReturnAString) {
      this.validationError('"files[].name" should be a function which returns a string.');
    }
  }

  concatEntityFiles() {
    return this.userSettigns.entities
               .map(e => e.files)
               .reduce((acc, next) => acc.concat(next));
  }

  validationError(msg) {
    logger.error(red(`${configFileName} is not valid. \n${msg}`));
    process.exit(1);
  }
};