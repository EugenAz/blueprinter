module.exports = class UserConfigValidator {

  constructor(userSettigns, entityName) {
    this.userSettigns = userSettigns;
    this.entityName = entityName;
  }

  validate() {
    this.entityIsRegistered();
    this.rootIsAString();

    this.validateEntities();
  }

  rootIsAString() {

  }

  entityIsRegistered() {

  }

  validateEntities() {
    this.templateFilesExist();
    this.namesAreStrings();
    this.aliasesAreArraysOfStrings();
  }

  templateFilesExist() {

  }

  namesAreStrings() {

  }

  aliasesAreArraysOfStrings() {

  }

};