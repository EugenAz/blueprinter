const commandName = 'validate';

module.exports = {
  validNames: [commandName],
  attachTo(program) {
    program
      .command(commandName)
      .description('Validate a configuration of the Blueprinter')
      .action(action);
  }
};

function action() {
}

