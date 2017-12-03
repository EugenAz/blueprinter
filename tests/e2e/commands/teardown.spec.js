const path = require('path');
const { tmpDirPath } = require('../../setup');
const { templatesDirName, configFileName } = require('../../../src/constants');
const { mkdirSync, writeFileSync, existsSync } = require('fs');
const { execSync } = require('child_process');

describe('`bpr teardown`', () => {
  const tplDirPath = path.join(tmpDirPath, templatesDirName);
  const confPath = path.join(tmpDirPath, configFileName);

  beforeEach(() => {
    mkdirSync(tplDirPath);
    writeFileSync(confPath, '');
  });

  describe('when run in the project root directory', () => {
    it('should have a root directory as a current working directory', () => {
      expect(process.cwd()).toBe(tmpDirPath);
    });

    checkThatBlueprinterTracesAreGone();
  });

  describe('when run in the project deeper than a root directory', () => {
    const newCwd = path.join(tmpDirPath, 'dirA');

    beforeEach(() => {
      mkdirSync(newCwd);
      process.chdir(newCwd);
    });

    afterEach(() => process.chdir(tmpDirPath));

    it('should have a directory deeper than a root as a current working directory', () => {
      expect(process.cwd()).not.toBe(tmpDirPath);
      expect(process.cwd()).toBe(newCwd);
    });

    checkThatBlueprinterTracesAreGone();
  });

  function checkThatBlueprinterTracesAreGone() {
    it('should remove a config file', () => {
      expect(existsSync(confPath)).toBe(true);

      execSync('bpr teardown');

      expect(existsSync(confPath)).toBe(false);
    });

    it('should remove a directory for templates', () => {
      expect(existsSync(tplDirPath)).toBe(true);

      execSync('bpr teardown');

      expect(existsSync(tplDirPath)).toBe(false);
    });
  }
});
