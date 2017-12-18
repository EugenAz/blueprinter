const { join } = require('path');
const { tplDirPath } = require('../../constants');
const { readFileSync, writeFileSync } = require('fs');
const { toCamelCase, capitalize } = require('../../utils/string');

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
    const tplPath = join(tplDirPath, tplName);

    return readFileSync(tplPath, 'utf-8');
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