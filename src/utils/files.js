const { sep, parse, join, dirname, resolve } = require('path');
const { existsSync, mkdirSync } = require('fs');

exports.findUp = (names, from) => {
  if (!Array.isArray(names)) {
    names = [names];
  }
  if (!from) {
    from = process.cwd();
  }
  const root = parse(from).root;

  let currentDir = from;
  while (currentDir && currentDir !== root) {
    for (const name of names) {
      const p = join(currentDir, name);
      if (existsSync(p)) {
        return p;
      }
    }

    currentDir = dirname(currentDir);
  }

  return null;
};

exports.createDirsRecursively = (startFrom, path) => {
  path
    .split(sep)
    .reduce((parentDir, childDir) => {
      const curDir = resolve(parentDir, childDir);
      if (!existsSync(curDir)) {
        mkdirSync(curDir);
      }

      return curDir;
    }, startFrom);
};