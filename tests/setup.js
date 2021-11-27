const { mkdirSync } = require('fs');
const rimrafSync = require('rimraf').sync;
const { join, resolve } = require('path');

const tmpDirPath = join(process.cwd(), 'tests', 'tmp');

exports.tmpDirPath = tmpDirPath;

exports.run = () => {
  beforeEach(() => {
    mkdirSync(tmpDirPath);
    mkdirSync(join(tmpDirPath, 'src'));
    process.chdir(tmpDirPath);
  });

  afterEach(() => {
    rimrafSync(tmpDirPath);
    process.chdir(resolve(tmpDirPath, '../../'));
  });
};
