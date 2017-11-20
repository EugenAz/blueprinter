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

function action(entity, pathOrName) {
  const userConfPath = findUp(configFileName);
  const getUserConfig = require(userConfPath);
  // 1. if entity is registered in config file. check alias as well
  // 2. if we should create a directory
  // 3. parse pathOrName. extract entityName if it is a path.
  // 4. create files using templates config registries
  // 4'. while creating files parse existing templates replacing special keywords with appropriate values

  console.log('generate "%s" "%s"', entity, pathOrName);
}

function help() {
  console.log('\n  Examples:');
  console.log();
  console.log('    $ bpr generate component abc');
  console.log('    $ bpr g component path/to/abc');
  console.log();
}