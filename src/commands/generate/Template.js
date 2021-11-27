const { join } = require('path');
const { existsSync, writeFileSync, readFileSync } = require('fs');
const { red } = require('chalk');
const { findUp } = require('../../utils/files');
const { templatesDirName } = require('../../constants');
const { toCamelCase, capitalize } = require('../../utils/string');
const logger = require('../../utils/logger');

module.exports = class Template {

  constructor(fileConfig, entityPath, name) {
    const fileName = fileConfig.name(name);
    this.filePath = join(entityPath, fileName);
    this.fileConfig = fileConfig;
    this.name = name;

    this.setFileContent();
  }

  writeToFile() {
    const fileContent = this.getParsedTemplate();
    writeFileSync(this.filePath, fileContent);
  }

  setFileContent() {
    this.fileContent = this.fileConfig.tpl || (this.fileConfig.tplName ?
                                               this.getTemplate(this.fileConfig.tplName) :
                                               '');
  }

  getParsedTemplate() {
    return this.parseFileContent();
  }

  getTemplate(tplName) {
    const tplDirPath = findUp(templatesDirName);
    if (tplDirPath) {
      const tplPath = join(tplDirPath, tplName);
      if (existsSync(tplPath)) {
        return readFileSync(tplPath, 'utf-8');
      } else {
        logger.error(red(`Template "${tplName}" could not be found in ${templatesDirName}`));
        process.exit(1);
      }
    } else {
      logger.error(red(
        `${templatesDirName} could not be found. \n\nYou either haven't initialized blueprinter (do it with 'bpr init')\nor running bpr command outside of your project.`));
      process.exit(1);
    }
  }

  parseFileContent() {
    const nameCamelCase = toCamelCase(this.name);
    const nameCapitalCamelCase = capitalize(nameCamelCase);

    let fileContent = this.fileContent;

    fileContent = fileContent.replace(/\$NAME_CAPITAL_CAMEL_CASE/g, nameCapitalCamelCase);
    fileContent = fileContent.replace(/\$NAME_CAMEL_CASE/g, nameCamelCase);
    fileContent = fileContent.replace(/\$NAME/g, this.name);

    return fileContent;
  }

};