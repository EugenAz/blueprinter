const program = require('commander');

const Blueprinter = require('./Blueprinter');
const commands = require('./commands');

module.exports = () => {
  const blueprinter = new Blueprinter(program);

  blueprinter.setCommands(
    ...commands
  );

  blueprinter.run();
};
