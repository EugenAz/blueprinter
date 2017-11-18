const { existsSync, rmdirSync, unlinkSync } = require('fs');
const { templatesDirName, templatesDirPath, configFileName, configFilePath } = require('../constants');

const commandName = 'teardown';

module.exports = {
  validNames: [commandName],
  attachTo(program) {
    program
      .command(commandName)
      .description('Remove files and directories related to the Blueprinter')
      .action(action);
  }
};

function action() {
  if (existsSync(templatesDirPath)) {
    rmdirSync(templatesDirPath);
    console.log(`Directory ${templatesDirName} deleted`);
  }

  if (existsSync(configFilePath)) {
    console.log('exists');
    unlinkSync(configFilePath);
    console.log(`File ${configFileName} deleted`);
  }

  console.log('Blueprinter teardown complete.');
}