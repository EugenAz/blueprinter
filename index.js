#!/usr/bin/env node
const program = require('commander');

program
  .version('0.0.1');

program.command('generate <entity> <path>').action(generate);
program.command('g <entity> <path>').action(generate);

function generate(entity, pathOrName) {
  console.log('generate "%s" "%s"', entity, pathOrName);
}

program.parse(process.argv);

// 1. bpr generate component abc-def
// 1'. bpr generate component ../path/to/component/abc-def
// 2. bpr generate module abc-def
// 2'. bpr generate module ../path/to/component/abc-def
// ...

// blueprinter-cli.conf.js
/*
{
  root: String, // default: 'src'
  entities: [
    {
      name: String,
      aliases: String[],
      newDir: boolean, // should the directory be created for the new entity
      files: [
        {
          name: entityName => `${entityName}.component.js`,
          tplName?: String, // if not provided - generated file will be empty
        },
      ]
    }

  ]
}
* */

// Templates will live in blueprinter-tpls.
// `bpr init` command.

// Template Parser
// Available variables $NAME.camelCase, $NAME.capitalCamelCase, $NAME.kebabCase
// or functions camelCase($NAME), capitalCamelCase($NAME), kebabCase($NAME)
/*
import { abc } from 'abc';

require('kebabCase($NAME).less');
require('kebabCase($NAME).html');

class capitalCamelCase($NAME) {
  constructor() {
  }

  render() {
    return (
      <div></div>
    );
  }
}

* */
