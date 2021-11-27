const Generator = require('./generate/Generator');
const GeneratorConfig = require('./generate/GeneratorConfig');

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
  const config = new GeneratorConfig(entityName, pathOrName);
  const generator = new Generator(config);

  generator.run();
}

function help() {
  logger.log('\n  Examples:');
  logger.log();
  logger.log('    $ bpr generate component abc');
  logger.log('    $ bpr g component path/to/abc');
  logger.log();
}
