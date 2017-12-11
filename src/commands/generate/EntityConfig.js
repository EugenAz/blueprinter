module.exports = class EntityConfig {

  constructor(data) {
    this.newDir = data.newDir;
    this.files = data.files;
  }

  shouldCreateNewDir() {
    return this.newDir;
  }

  getFiles() {
    return this.files;
  }

};