const path = require('path');
const { existsSync, mkdirSync, writeFileSync } = require('fs');
const { templatesDirName, configFileName } = require('../constants');

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
  const pathJoinRoot = path.join.bind(path, process.cwd());

  createTemplatesDirIfNotExist(
    pathJoinRoot(templatesDirName)
  );

  createConfigFileIfNotExist(
    pathJoinRoot(configFileName)
  );
}

function createTemplatesDirIfNotExist(templatesDirPath) {
  if (!existsSync(templatesDirPath)) {
    mkdirSync(templatesDirPath);
    console.log(`Directory ${templatesDirName} created`);
  } else {
    console.log(`Directory ${templatesDirName} already exists`);
  }
}

function createConfigFileIfNotExist(configFilePath) {
  if (!existsSync(configFilePath)) {
    writeFileSync(configFilePath, require('../config-tpl'));
    console.log(`File ${configFileName} created`);
  } else {
    console.log(`File ${configFileName} already exists`);
  }
}