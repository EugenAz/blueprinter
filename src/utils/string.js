module.exports = {
  toCamelCase,
  capitalize
};

function toCamelCase(str) {
  return str.replace(/-([a-z])/g, g => g[1].toUpperCase());
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
