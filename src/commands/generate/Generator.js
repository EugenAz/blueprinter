const { join, resolve } = require('path');
const { createDirsRecursively } = require('../../utils/files');
const Template = require('./Template');

module.exports = class Generator {

  constructor(config) {
    this.config = config;
    this.userConfig = this.config.getUserConfig();
    this.entityConfig = this.userConfig.getEntityConfig();
  }

  run() {
    const root = this.userConfig.getRoot();
    const path = this.config.getPath();
    const rootPath = join(root, path);

    this.createNeededDirectories(rootPath);
    this.createFiles(rootPath);
  }

  createNeededDirectories(rootPath) {
    const startFrom = process.cwd();

    createDirsRecursively(startFrom, rootPath);
  }

  createFiles(rootPath) {
    const entityPath = resolve(process.cwd(), rootPath);
    const name = this.config.getName();
    const entityFiles = this.entityConfig.getFiles();

    entityFiles.forEach(fileConfig => {
      const template = new Template(fileConfig, entityPath, name);
      template.writeToFile();
    });
  }

};