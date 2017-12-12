const { red } = require('chalk');
const { findUp } = require('../../utils/files');
const { configFileName } = require('../../constants');
const { cleanPathFromSeparators } = require('../../utils/string');
const logger = require('../../utils/logger');
const EntityConfig = require('./EntityConfig');
const UserConfigValidator = require('./UserConfigValidator');

let userConfigInstance;

module.exports = class UserConfig {

  static build(...args) {
    if (!userConfigInstance) {
      userConfigInstance = new UserConfig(...args);
    }

    return userConfigInstance;
  }

  constructor(entityName) {
    this.entityName = entityName;

    this.init();
  }

  getRoot() {
    return this.root;
  }

  getEntityConfig() {
    return this.entityConfig;
  }

  init() {
    this.userSettigns = this.getUserSettingsOrExit();

    this.validateUserConfig();

    this.entityConfig = this.getEntityConfigOrExit();
    this.root = cleanPathFromSeparators(this.userSettigns.root);
  }

  getUserSettingsOrExit() {
    const userConfPath = findUp(configFileName);

    if (!userConfPath) {
      logger.error(red(
        `${configFileName} could not be found. \n\nYou either haven't initialized blueprinter (do it with 'bpr init')\nor running bpr command outside of your project.`));
      process.exit(1);
    }

    return  require(userConfPath)();
  }

  validateUserConfig() {
    const userConfigValidator = new UserConfigValidator(this.userSettigns, this.entityName);
    userConfigValidator.validate();
  }

  getEntityConfigOrExit() {
    const entityConfig = this.userSettigns.entities.find(
      e => e.name === this.entityName || e.aliases.includes(this.entityName));

    if (!entityConfig) {
      logger.error(
        red(`Entity "${this.entityName}" is not found in your ${configFileName}. Please make sure that it's there.`));
      process.exit(1);
    }

    return new EntityConfig(entityConfig);
  }

};
