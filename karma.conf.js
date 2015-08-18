module.exports = function (config) {
  var configuration = {
    basePath: './src',
    browsers: ['Chrome'],
    frameworks: ['angular', 'mocha', 'sinon-chai', 'browserify', 'phantomjs-shim'],
    reporters: ['mocha'],
    angular: ['mocks'],
    files: [
      { pattern: './**/*.spec.js', watched: false }
    ],
    preprocessors: {
      './**/*.js': ['browserify']
    },
    browserify: {
      debug: true,
      transform: [
        ['babelify', { stage: 0 }]
      ]
    },
    customLaunchers: {
      ChromeTravis: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    },
    client: {
      mocha: {
        timeout: 20000
      }
    },
    browserDisconnectTimeout: 20000
  };

  if(process.env.TRAVIS){
    configuration.browsers = ['ChromeTravis'];
    configuration.reporters = ['dots'];
  }
  config.set(configuration);
};