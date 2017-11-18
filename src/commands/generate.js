const commandName = 'generate';
const alias = 'g';

module.exports = {
  validNames: [commandName, alias],
  attachTo(program) {
    program
      .command(`${commandName} [entity] [path]`)
      .alias(alias)
      .description('Generates entity')
      .action(generate)
      .on('--help', help);
  }
};

function generate(entity, pathOrName) {
  console.log('generate "%s" "%s"', entity, pathOrName);
}

function help() {
  console.log('\n  Examples:');
  console.log();
  console.log('    $ bpr generate component abc');
  console.log('    $ bpr g component path/to/abc');
  console.log();
}