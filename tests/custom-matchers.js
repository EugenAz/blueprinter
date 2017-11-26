const { existsSync } = require('fs');

exports = {
  toBeAnExistingFileOrDirectory() {
    return {
      compare(path) {
        const result = {};

        result.pass = path && existsSync(path);

        if (result.pass) {
          result.message = `Expected ${path} not to be an existing file or directory`;
        } else {
          result.message = `Expected ${path} to be an existing file or directory`;
        }

        return result;
      }
    };
  }
};