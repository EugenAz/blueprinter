const rootPath = process.cwd();

const templatesDirName = 'blueprinter-tpls';
const configFileName = 'blueprinter-cli.conf.js';

const templatesDirPath = rootPath + '/' + templatesDirName;
const configFilePath = rootPath + '/' + configFileName;

module.exports = {
  templatesDirName,
  templatesDirPath,
  configFileName,
  configFilePath,
};