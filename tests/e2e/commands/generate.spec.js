const { execSync } = require('child_process');

describe('`bpr generate`', () => {

  it('should exit if config file does not exist', () => {
    expect(() => execSync('bpr generate component abc')).toThrow();

    try {
      execSync('bpr generate component abc');
    } catch(e) {
      expect(e.status).toBe(1);
    }
  });
  
  it('should generate files by config using name', () => {
    execSync('bpr generate component abc');
  });
  
  xit('should generate files by config using path', () => {
    execSync('bpr generate component ./abc/def/componentA');
  });
  
  xit('should generate files by config using alias and path', () => {
    execSync('bpr generate c ./abc/def/componentA');
  });
  
  xit('should put generated files in the new directory if configured so', () => {
    execSync('bpr generate c ./abc/def/componentA');
  });
  
  xit('should provide an alias `g`', () => {
    execSync('bpr g c abc');
  });

  xdescribe('test the root configuration', () => {});
  xdescribe('dynamically replace special keywords in templates with values', () => {});
  xdescribe('while validating the config file', () => {});
});
