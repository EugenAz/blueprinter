const path = require('path');
const { existsSync } = require('fs');

module.exports = (names, from) => {
  if (!Array.isArray(names)) {
    names = [names];
  }
  if (!from) {
    from = process.cwd();
  }
  const root = path.parse(from).root;

  let currentDir = from;
  while (currentDir && currentDir !== root) {
    for (const name of names) {
      const p = path.join(currentDir, name);
      if (existsSync(p)) {
        return p;
      }
    }

    currentDir = path.dirname(currentDir);
  }

  return null;
};
