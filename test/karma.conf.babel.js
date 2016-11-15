const istanbul = require('browserify-istanbul'),
  isparta = require('isparta'),
  customLaunchers = {
    sl_chrome: {
      base: 'SauceLabs',
      browserName: 'chrome',
      platform: 'Windows 7',
      version: '35'
    },
    sl_ie_11: {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      platform: 'Windows 7',
      version: '35'
    }
  },
  karmaBaseConfig = {
    frameworks: ['angular', 'jasmine', 'sinon', 'browserify'],

    angular: ['mocks'],

    basePath: './',

    files: [
      {
        pattern: '../src/**/*.spec.js',
        watched: false
      }
    ],

    preprocessors: {
      '../src/**/*.js': ['browserify']
    },

    browserify: {
      debug: true,
      transform: [
        istanbul({
          instrumenter: isparta,
          instrumenterConfig: { embedSource: true },
          ignore: [
            '**/*.spec.js'
          ]
        }),
        'babelify'
      ]
    },

    browsers: ['PhantomJS'],
    phantomjsLauncher: {
      exitOnResourceError: true
    },
    reporters: ['progress', 'coverage'],
    singleRun: true,

    coverageReporter: {
      dir: './coverage',
      reporters: [
        {type: 'html'},
        {type: 'text-summary'}
      ]
    },

    captureTimeout: 60000,
    browserDisconnectTimeout: 20000,
    browserNoActivityTimeout: 100000
  };

export default (config) => {
  if (process.env.TRAVIS) {
    config.sauceLabs = {
      testName: 'angular-data-table unit tests'
    };
    config.customLaunchers = customLaunchers;
    config.browsers = Object.keys(customLaunchers);
    config.reporters = ['dots', 'saucelabs'];
    config.singleRun = true;
  }

  config.set(karmaBaseConfig);
};
