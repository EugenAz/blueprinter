const { existsSync } = require('fs');
const rimraf = require('rimraf');
const findUp = require('../utils/find-up');
const { templatesDirName, configFileName } = require('../constants');

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
  removeTemplatesDirIfExists();
  removeConfigFileIfExists();

  console.log('Blueprinter teardown complete.');
}

function removeTemplatesDirIfExists() {
  const templatesDirPath = findUp(templatesDirName);

  if (templatesDirPath && existsSync(templatesDirPath)) {
    rimraf(templatesDirPath, e => {
      if (e) {
        console.error(e);
      } else {
        console.log(`Directory ${templatesDirName} deleted`);
      }
    });
  }
}

function removeConfigFileIfExists() {
  const configFilePath = findUp(configFileName);

  if (existsSync(configFilePath)) {
    rimraf(configFilePath, e => {
      if (e) {
        console.error(e);
      } else {
        console.log(`File ${configFileName} deleted`);
      }
    });
  }
}
