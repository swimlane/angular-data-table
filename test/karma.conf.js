require('babel-core/register');

// reference: https://github.com/karma-runner/karma/issues/1597#issuecomment-165908585
module.exports = require('./karma.conf.babel').default;
