const { sep } = require('path');
const UserConfig = require('./UserConfig');

module.exports = class GeneratorConfig {

  constructor(entityName, pathOrName) {
    this.entityName = entityName;

    this.init(pathOrName);
  }

  getUserConfig() {
    return UserConfig.build(this.entityName);
  }

  getName() {
    return this.name;
  }

  getPath() {
    return this.path;
  }

  init(pathOrName) {
    const [name, path] = this.separateNameFromPath(pathOrName);

    this.setNameAndPath(name, path);
  }

  separateNameFromPath(pathOrName) {
    pathOrName = pathOrName.replace(/\.+\//g, '');
    let name = pathOrName.split('/');
    let path = name.slice(0, -1).join(sep);
    name = name[name.length - 1];

    return [name, path];
  }

  setNameAndPath(name, path) {
    const userConfig = this.getUserConfig();
    const entityConfig = userConfig.getEntityConfig();

    this.name = name;
    this.path = entityConfig.shouldCreateNewDir()
      ? path + sep + this.name
      : path;
  }

};