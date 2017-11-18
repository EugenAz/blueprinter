const { version } = require('../package.json');

class Blueprinter {
  constructor(program) {
    this.program = program.version(version);

    this.validCommandNames = [];

    this.setValidation();
  }

  setValidation() {
    this.program
      .action(cmd => {
        if (!this.validCommandNames.includes(cmd)) {
          console.error(`Error: Unknown command "${cmd}"`);
          process.exit(1);
        }
      });
  }

  setCommands(...commands) {
    commands.forEach(command => {
      this.validCommandNames.push(command.validNames);
      command.attachTo(this.program);
    });
  }

  run() {
    this.program.parse(process.argv);
  }
}

module.exports = Blueprinter;