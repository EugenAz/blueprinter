const path = require('path');

module.exports = {
  toCamelCase,
  capitalize,
  cleanPathFromSeparators
};

function toCamelCase(str) {
  return str.replace(/-([a-z])/g, g => g[1].toUpperCase());
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function cleanPathFromSeparators(p) {
  if (p.startsWith(path.sep)) {
    p = p.slice(1);
  }

  if (p.endsWith(path.sep)) {
    p = p.slice(0, -1);
  }

  return p;
}