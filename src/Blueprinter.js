const { version } = require('../package.json');
const chalk = require('chalk');

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
          console.error(chalk.red(`Error: Unknown command `) + chalk.bold.red(`"${cmd}"`));
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