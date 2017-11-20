module.exports = `module.exports = () => ({
  root: 'src',
  entities: [
    {
      name: 'component',
      aliases: ['c'],
      newDir: true,
      files: [
        {
          name: entityName => \`\${entityName}.component.js\`,
          tplName: 'component.js.tpl'
        },
      ]
    },
  ]
});`;
