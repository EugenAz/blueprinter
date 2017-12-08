const { existsSync, mkdirSync, writeFileSync, readFileSync } = require('fs');
const { sep, join, resolve } = require('path');
const { red } = require('chalk');
const { findUp, createDirsRecursively } = require('../utils/files');
const { configFileName, templatesDirName } = require('../constants');
const { toCamelCase, capitalize, cleanPathFromSeparators } = require('../utils/string');
const logger = require('../utils/logger');

const commandName = 'generate';
const alias = 'g';

module.exports = {
  validNames: [commandName, alias],
  attachTo(program) {
    program
      .command(`${commandName} [entity] [path]`)
      .alias(alias)
      .description('Generates entity')
      .action(action)
      .on('--help', help);
  }
};

function action(entityName, pathOrName) {
  const userConfig = getUserConfigOrExit();
  const entityConfig = findEntityConfigOrExit(entityName, userConfig);
  const root = cleanPathFromSeparators(userConfig.root);
  let [name, newPath] = separateNameFromPath(pathOrName);

  // TODO validate user config

  if (entityConfig.newDir) {
    newPath += sep + name;
  }

  createNeededDirectories(root, newPath);
  const entityPath = resolve(process.cwd(), root, newPath);
  createFiles(entityConfig.files, name, entityPath);
}

function getUserConfigOrExit() {
  const userConfPath = findUp(configFileName);

  if (!userConfPath) {
    logger.error(red(
      `${configFileName} could not be found. \n\nYou either haven't initialized blueprinter (do it with 'bpr init')\nor running bpr command outside of your project.`));
    process.exit(1);
  }

  return require(userConfPath)();
}

function findEntityConfigOrExit(entityName, config) {
  const entityConfig = config.entities.find(
    e => e.name === entityName || e.aliases.includes(entityName));

  if (!entityConfig) {
    logger.error(
      red(`Entity "${entityName}" is not found in your ${configFileName}. Please make sure that it's there.`));
    process.exit(1);
  }

  return entityConfig;
}

function currentWorkingDirectoryContainsSrcRootPath(cwd, srcRoot) {
  return cwd.includes(`${sep}${srcRoot}${sep}`) ||
         cwd.endsWith(`${sep}${srcRoot}`);
}

function separateNameFromPath(pathOrName) {
  pathOrName = pathOrName.replace(/\.+\//g, '');
  let name = pathOrName.split('/');
  let newPath = name.slice(0, -1).join(sep);
  name = name[name.length - 1];

  return [name, newPath];
}

function createNeededDirectories(rootPath, newPath) {
  const startFrom = process.cwd();
  const path = join(rootPath, newPath);

  createDirsRecursively(startFrom, path);
}

function createFiles(filesConfig, name, entityPath) {
  filesConfig.forEach(file => {
    const fileName = file.name(name);
    const filePath = join(entityPath, fileName);

    if (!existsSync(filePath)) {
      const fileContent = file.tpl
        ? file.tpl
        : file.tplName
                            ? getTemplate(file.tplName)
                            : '';

      writeFileSync(filePath, parseFileContent(fileContent, name));
    }
  });
}

function getTemplate(tplName) {
  const tplDirPath = findUp(templatesDirName);
  if (tplDirPath) {
    const tplPath = join(tplDirPath, tplName);
    if (existsSync(tplPath)) {
      return readFileSync(tplPath, 'utf-8');
    } else {
      logger.error(red(`Template "${tplName}" could not be found in ${templatesDirName}`));
      process.exit(1);
    }
  } else {
    logger.error(red(
      `${templatesDirName} could not be found. \n\nYou either haven't initialized blueprinter (do it with 'bpr init')\nor running bpr command outside of your project.`));
    process.exit(1);
  }
}

function parseFileContent(fileContent, name) {
  const nameCamelCase = toCamelCase(name);
  const nameCapitalCamelCase = capitalize(nameCamelCase);

  fileContent = fileContent.replace(/\$NAME_CAPITAL_CAMEL_CASE/g, nameCapitalCamelCase);
  fileContent = fileContent.replace(/\$NAME_CAMEL_CASE/g, nameCamelCase);
  fileContent = fileContent.replace(/\$NAME/g, name);

  return fileContent;
}

function help() {
  logger.log('\n  Examples:');
  logger.log();
  logger.log('    $ bpr generate component abc');
  logger.log('    $ bpr g component path/to/abc');
  logger.log();
}
