const { existsSync, mkdirSync, writeFileSync } = require('fs');
const { templatesDirName, templatesDirPath, configFileName, configFilePath } = require('../constants');
const configDefaults = require('../config-defaults');

const commandName = 'init';

module.exports = {
  validNames: [commandName],
  attachTo(program) {
    program
      .command(commandName)
      .description(
        'Bootstrap blueprinter for your project. Creates the directory for your templates files. And configuration file.')
      .action(action);
  }
};

function action() {
  if (!existsSync(templatesDirPath)) {
    mkdirSync(templatesDirPath);
    console.log(`Directory ${templatesDirName} created`);
  } else {
    console.log(`Directory ${templatesDirName} already exists`);
  }

  if (!existsSync(configFilePath)) {
    writeFileSync(configFilePath, configDefaults);
    console.log(`File ${configFileName} created`);
  } else {
    console.log(`File ${configFileName} already exists`);
  }
}