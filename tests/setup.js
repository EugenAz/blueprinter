const { mkdirSync } = require('fs');
const rimrafSync = require('rimraf').sync;
const path = require('path');

const tmpDirPath = path.join(process.cwd(), 'tests', 'tmp');

exports.tmpDirPath = tmpDirPath;

exports.run = () => {
  beforeEach(() => {
    mkdirSync(tmpDirPath);
    process.chdir(tmpDirPath);
  });

  afterEach(() => {
    rimrafSync(tmpDirPath);
    process.chdir(path.resolve(tmpDirPath, '../../'));
  });
};
