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
    this.entitiesValueIsANonEmptyArray();
    this.rootIsAString();
    this.entityIsRegistered();
    this.entityNamesAreNotAmbiguous();
    this.templateFilesExist();
    this.namesAreStrings();
    this.aliasesAreArraysOfStrings();
    this.aliasesAreNotAmbiguous();
    this.newDirPropertyIsOfBooleanType();
    this.fileNameIsAFunctionWhichReturnsAString();
    this.tplIsAString();
    this.tplNameIsAString();
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

  entityNamesAreNotAmbiguous() {

  }

  templateFilesExist() {
    const tplFilesWhichNotExist = this.userSettigns.entities
                                       .map(e => e.files.filter(f => f.tplName))
                                       .reduce((acc, next) => acc.concat(next))
                                       .map(f => f.tplName)
                                       .filter(tplName => !existsSync(join(tplDirPath, tplName)));

    if (tplFilesWhichNotExist.length) {
      this.validationError(`Templates ${tplFilesWhichNotExist.join(', ')} could not be found in ${templatesDirName} directory.`);
    }
  }

  namesAreStrings() {

  }

  aliasesAreArraysOfStrings() {

  }

  aliasesAreNotAmbiguous() {

  }

  newDirPropertyIsOfBooleanType() {

  }

  fileNameIsAFunctionWhichReturnsAString() {

  }

  tplIsAString() {

  }

  tplNameIsAString() {

  }

  validationError(msg) {
    logger.error(red(`${configFileName} is not valid. \n\n${msg}`));
    process.exit(1);
  }
};