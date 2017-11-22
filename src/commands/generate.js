const { existsSync } = require('fs');
const path = require('path');
const chalk = require('chalk');
const findUp = require('../utils/find-up');
const { configFileName } = require('../constants');
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
  const entityBasePath = buildEntityBasePath(userConfig.root);
  // 2. parse pathOrName. extract entityName if it is a path.
  // 3. if we should create a directory
  // 4. create files using templates config registries
  // 4'. while creating files parse existing templates replacing special keywords with appropriate values

  console.log('generate "%s" "%s"', entityName, pathOrName);
}

function getUserConfigOrExit() {
  const userConfPath = findUp(configFileName);

  if (!userConfPath) {
    console.error(chalk.red(
      `${configFileName} wasn't found. \n\nYou either haven't initialized blueprinter (do it with 'bpr init')\nor running bpr command outside of your project.`));
    process.exit(1);
  }

  return require(userConfPath)();
}

function findEntityConfigOrExit(entityName, config) {
  const entityConfig = config.entities.find(e =>
    e.name === entityName || e.aliases.includes(entityName));

  if (!entityConfig) {
    console.error(
      chalk.red(`Entity "${entityName}" is not found in your ${configFileName}. Please make sure that it's there.`));
    process.exit(1);
  }

  return entityConfig;
}

function buildEntityBasePath(srcRoot) {
  const cwd = process.cwd();

  srcRoot = cleanFromPathSeparators(srcRoot);

  if (currentWorkingDirectoryContainsSrcRootPath(cwd, srcRoot)) {
    return cwd;
  }

  const presumableSrcPath = path.join(cwd, srcRoot);
  if (existsSync(presumableSrcPath)) {
    return presumableSrcPath;
  }

  console.error(
    chalk.red(`Blueprinter root directory ("${srcRoot}") specified in your ${configFileName} could not be found.`));
  process.exit(1);
}

function cleanFromPathSeparators(p) {
  return p.replace(new RegExp(`\\${path.sep}`, 'g'), '');
}

function currentWorkingDirectoryContainsSrcRootPath(cwd, srcRoot) {
  return cwd.includes(`${path.sep}${srcRoot}${path.sep}`) ||
         cwd.endsWith(`${path.sep}${srcRoot}`);
}

function help() {
  console.log('\n  Examples:');
  console.log();
  console.log('    $ bpr generate component abc');
  console.log('    $ bpr g component path/to/abc');
  console.log();
}
