const { execSync } = require('child_process');
const { resolve, join } = require('path');
const { existsSync, readFileSync } = require('fs');

const { copy } = require('../../utils');
const { tmpDirPath } = require('../../setup');
const { templatesDirName, configFileName } = require('../../../src/constants');

describe('`bpr generate`', () => {
  const configRoot = 'src';

  it('should exit if config file does not exist', () => {
    const command = 'bpr generate component abc';
    expect(() => execSync(command)).toThrow();

    try {
      execSync(command);
    } catch (e) {
      expect(e.status).toBe(1);
    }
  });

  describe('when config file exists', () => {

    beforeEach(done => {
      const testsDir = resolve(tmpDirPath, '..');

      Promise.all([
               copy(join(testsDir, 'fixtures', configFileName), join(tmpDirPath, configFileName)),
               copy(join(testsDir, 'fixtures', templatesDirName), join(tmpDirPath, templatesDirName))
             ])
             .then(done);
    });

    it('should exit if requested entity is not registered in the config file', () => {
      const command = 'bpr generate someNotExistentEntity abc';

      expect(() => execSync(command)).toThrow();

      try {
        execSync(command);
      } catch (e) {
        expect(e.status).toBe(1);
      }
    });

    it('should generate files by config using name', () => {
      execSync('bpr generate some1 abc');

      expect(existsSync(join(tmpDirPath, configRoot, 'abc.file'))).toBe(true);
    });

    it('should generate files by config using path', () => {
      execSync('bpr generate some1 ./abc/def/componentA');

      expect(existsSync(join(tmpDirPath, configRoot, 'abc', 'def', 'componentA.file'))).toBe(true);
    });

    it('should generate files by config using alias and path', () => {
      execSync('bpr generate s1 ./abc/def/componentA');

      expect(existsSync(join(tmpDirPath, configRoot, 'abc', 'def', 'componentA.file'))).toBe(true);
    });

    it('should put generated files in the new directory if configured so', () => {
      execSync('bpr generate some11 ./abc/def/componentA');

      expect(existsSync(join(tmpDirPath, configRoot, 'abc', 'def', 'componentA', 'componentA.file'))).toBe(true);
    });

    it('should use tpl config property for file generation', () => {
      execSync('bpr generate some3 componentA');

      const fileContent = readFileSync(join(tmpDirPath, configRoot, 'componentA.file1'), 'utf-8');

      expect(fileContent).toBe('<h1>First template generate using "tpl" config property</h1>');
    });

    it('should generate an empty file if neither tpl not tplName were specified in the config', () => {
      execSync('bpr generate some3 componentA');

      const fileContent = readFileSync(join(tmpDirPath, configRoot, 'componentA.file2'), 'utf-8');

      expect(fileContent).toBe('');
    });

    it('should provide an alias `g`', () => {
      execSync('bpr g s1 componentA');

      expect(existsSync(join(tmpDirPath, configRoot, 'componentA.file'))).toBe(true);
    });
  });

  //xdescribe('test the root configuration', () => {});
  //xdescribe('dynamically replace special keywords in templates with values', () => {});
  //xdescribe('while validating the config file', () => {});
});
