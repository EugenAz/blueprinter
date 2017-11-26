#!/usr/bin/env node

const glob = require('glob');
const path = require('path');
const Jasmine = require('jasmine');

const runSetup = require('./setup').run;
const customMatchers = require('./custom-matchers');

const jasmine = new Jasmine({ projectBaseDir: __dirname });
jasmine.loadConfig({});
jasmine.onComplete((success) => process.exitCode = !success);

runSetup();
// https://github.com/jasmine/jasmine/issues/1452
jasmine.addMatchers(customMatchers);
jasmine.execute(
  glob.sync('tests/e2e/**/*.spec.js')
      .map(p => path.relative(__dirname, p))
);
