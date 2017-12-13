const { red } = require('chalk');
const logger = require('../../utils/logger');
const { configFileName } = require('../../constants');

module.exports = class UserConfigValidator {

  constructor(userSettigns, entityName) {
    this.userSettigns = userSettigns;
    this.entityName = entityName;
  }

  validate() {
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
                                       .filter(name => {
                                          // TODO
                                       });

    if (tplFilesWhichNotExist.length) {
      this.validationError(`The files for the registered templates ${tplFilesWhichNotExist.join(', ')} could not be found.`);
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