#!/usr/bin/env node

const glob = require('glob');
const path = require('path');
const Jasmine = require('jasmine');
const runSetup = require('./setup').run;

const projectBaseDir = path.join(__dirname, '');

const jasmine = new Jasmine({ projectBaseDir: projectBaseDir });
jasmine.loadConfig({});
jasmine.onComplete((success) => process.exitCode = !success);

const allTests = glob.sync('tests/e2e/**/*.spec.js')
                     .map(p => path.relative(projectBaseDir, p));

runSetup();
jasmine.execute(allTests);
