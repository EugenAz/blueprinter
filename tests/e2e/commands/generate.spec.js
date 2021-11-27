const { execSync } = require('child_process');
const { resolve, join } = require('path');
const { existsSync, readFileSync } = require('fs');

const { copy, generateConfigFile } = require('../../utils');
const { tmpDirPath } = require('../../setup');
const { templatesDirName } = require('../../../src/constants');

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

      generateConfigFile();
      copy(join(testsDir, 'fixtures', templatesDirName), join(tmpDirPath, templatesDirName))
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

      expect(fileContent.trim()).toBe('<h1>First template generated using "tpl" config property</h1>');
      '<h1>First template generate using "tpl" config property</h1>'
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

    it('should take root configuration value as a root directory', () => {
      const root = join('deep', 'root', 'dir');

      generateConfigFile(root);

      execSync('bpr generate some1 abc');

      expect(existsSync(join(tmpDirPath, root, 'abc.file'))).toBe(true);
    });

    describe('replacing special keywords', () => {
      const name = 'kebab-case-name';

      beforeEach(() => execSync(`bpr generate some2 ${name}`));

      it('should replace $NAME in tpl with actual name from command', () => {
        const contentOfTpl = readFileSync(join(tmpDirPath, templatesDirName, 'tpl2'), 'utf-8');

        expect(contentOfTpl).toBe(`<h1>Entity name: $NAME</h1>`);

        const contentOfFile = readFileSync(join(tmpDirPath, configRoot, `${name}.tpl2.file`),
          'utf-8');

        expect(contentOfFile).toBe(`<h1>Entity name: kebab-case-name</h1>`);
      });

      it('should replace $NAME_CAMEL_CASE in tpl with actual camel cased name from command', () => {
        const contentOfTpl = readFileSync(join(tmpDirPath, templatesDirName, 'tpl3'), 'utf-8');

        expect(contentOfTpl).toBe(`<h1>Entity name: $NAME_CAMEL_CASE</h1>`);

        const contentOfFile = readFileSync(join(tmpDirPath, configRoot, `${name}.tpl3.file`),
          'utf-8');

        expect(contentOfFile).toBe(`<h1>Entity name: kebabCaseName</h1>`);
      });

      it('should replace $NAME_CAPITAL_CAMEL_CASE in tpl with actual camel capitalized cased name from command', () => {
        const contentOfTpl = readFileSync(join(tmpDirPath, templatesDirName, 'tpl4'), 'utf-8');

        expect(contentOfTpl).toBe(`<h1>Entity name: $NAME_CAPITAL_CAMEL_CASE</h1>`);

        const contentOfFile = readFileSync(join(tmpDirPath, configRoot, `${name}.tpl4.file`),
          'utf-8');

        expect(contentOfFile).toBe(`<h1>Entity name: KebabCaseName</h1>`);
      });
    });

  });

  //xdescribe('while validating the config file', () => {});
});
