const { findUp } = require('./utils/files');

exports.templatesDirName = 'blueprinter-tpls';
exports.configFileName = 'blueprinter-cli.conf.js';

exports.tplDirPath = findUp(exports.templatesDirName);
exports.userConfPath = findUp(exports.configFileName);
