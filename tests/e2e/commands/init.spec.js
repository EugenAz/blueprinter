const { execSync } = require('child_process');
const { existsSync, writeFileSync, readFileSync } = require('fs');
const path = require('path');
const { templatesDirName, configFileName } = require('../../../src/constants');
const { tmpDirPath } = require('../../setup');

describe('`bpr init`', () => {
  it('should create a directory for templates', () => {
    const tplDirPath = path.join(tmpDirPath, templatesDirName);

    expect(existsSync(tplDirPath)).toBe(false);

    execSync('bpr init');

    expect(existsSync(tplDirPath)).toBe(true);
  });

  describe('should create a config file', () => {
    const configPath = path.join(tmpDirPath, configFileName);

    it('', () => {
      expect(existsSync(configPath)).toBe(false);

      execSync('bpr init');

      expect(existsSync(configPath)).toBe(true);
    });

    it('should not rewrite a config file if it already exists', () => {
      const configFileContent = 'The parallel beauty of intuition is to gain with suffering.';

      writeFileSync(configPath, configFileContent);

      expect(existsSync(configPath)).toBe(true);

      execSync('bpr init');

      expect(readFileSync(configPath).toString('utf8')).toBe(configFileContent);
    });
  });

});