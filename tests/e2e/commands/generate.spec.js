const { execSync } = require('child_process');

describe('`bpr generate`', () => {

  xit('should exit if config file does not exist', () => {
    execSync('bpr generate component abc');
  });
  
  xit('should generate files by config using name', () => {
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

  describe('while validating the config file', () => {
  });
});
