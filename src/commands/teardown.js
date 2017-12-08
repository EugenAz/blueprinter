const { existsSync } = require('fs');
const rimraf = require('rimraf');
const { findUp } = require('../utils/files');
const { templatesDirName, configFileName } = require('../constants');
const chalk = require('chalk');
const logger = require('../utils/logger');

const commandName = 'teardown';

module.exports = {
  validNames: [commandName],
  attachTo(program) {
    program
      .command(commandName)
      .description('Remove files and directories related to the Blueprinter')
      .action(action);
  }
};

function action() {
  Promise.all([
           removeTemplatesDirIfExists(),
           removeConfigFileIfExists()
         ])
         .then(() => {
           logger.log(chalk.green('Blueprinter teardown complete.'));
         })
         .catch(e => {
           logger.error(chalk.red(e));
           process.exit(1);
         });
}

function removeTemplatesDirIfExists() {
  return new Promise((resolve, reject) => {
    const templatesDirPath = findUp(templatesDirName);

    if (templatesDirPath && existsSync(templatesDirPath)) {
      rimraf(templatesDirPath, e => {
        if (e) {
          reject(e);
        } else {
          logger.log(chalk.green(`Directory ${templatesDirName} deleted`));
          resolve();
        }
      });
    }
  });
}

function removeConfigFileIfExists() {
  return new Promise((resolve, reject) => {
    const configFilePath = findUp(configFileName);

    if (existsSync(configFilePath)) {
      rimraf(configFilePath, e => {
        if (e) {
          reject(e);
        } else {
          logger.log(chalk.green(`File ${configFileName} deleted`));
          resolve();
        }
      });
    }
  });
}
