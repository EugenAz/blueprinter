const { ncp } = require('ncp');
const { writeFileSync } = require('fs');
const { join } = require('path');

const { tmpDirPath } = require('./setup');
const { configFileName } = require('../src/constants');

exports.copy = (source, destination) => new Promise((resolve, reject) => {
  ncp(source, destination, err => {
    if (err) {
      reject(err);
    }

    resolve();
  });
});

exports.generateConfigFile = root => {
  root = root || 'src';

  const configTpl = getConfigTpl(root);

  const configPath = join(tmpDirPath, configFileName);

  writeFileSync(configPath, configTpl);
};

function getConfigTpl(root) {
  return `
    module.exports = () => ({
      root: "${root}",
      entities: [
        {
          name: "some1",
          aliases: ["s1"],
          files: [
            {
              name: entityName => entityName + '.file',
              tplName: "tpl1"
            },
          ]
        },
        {
          name: "some11",
          aliases: ["s11"],
          newDir: true,
          files: [
            {
              name: entityName => entityName + '.file',
              tplName: "tpl1"
            },
          ]
        },
        {
          name: "some2",
          aliases: ["s2"],
          files: [
            {
              name: entityName => entityName + '.tpl2.file',
              tplName: "tpl2"
            },
            {
              name: entityName => entityName + '.tpl3.file',
              tplName: "tpl3"
            },
            {
              name: entityName => entityName + '.tpl4.file',
              tplName: "tpl4"
            },
          ]
        },
        {
          name: "some3",
          aliases: ["s3"],
          files: [
            {
              name: entityName => entityName + '.file1',
              tpl: '<h1>First template generate using "tpl" config property</h1>'
            },
            {
              name: entityName => entityName + '.file2',
            }
          ]
        }
      ]
    });
  `;
}
