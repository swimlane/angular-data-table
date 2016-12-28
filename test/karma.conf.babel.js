const istanbul = require('browserify-istanbul'),
  isparta = require('isparta'),

  // Configure more at: https://wiki.saucelabs.com/display/DOCS/Platform+Configurator#/
  customLaunchers = {
    sl_chrome: {
      base: 'SauceLabs',
      browserName: 'chrome',
      platform: 'Windows 7',
      version: '35'
    },
    sl_ie_11: {
      base: 'SauceLabs',
      browserName: 'Internet Explorer',
      platform: 'Windows 7',
      version: '11.0'
    }
  },

  karmaBaseConfig = {
    frameworks: ['browserify', 'source-map-support', 'jasmine'],

    basePath: './',

    files: [
      './dataTable.mock.js',
      '../node_modules/sinon/pkg/sinon.js',
      '../node_modules/bardjs/dist/bard.js',
      '../node_modules/angular-mocks/angular-mocks.js',
      './karma.helper.babel.js',
      '../src/**/*.spec.js'
    ],

    preprocessors: {
      './dataTable.mock.js': ['browserify'],
      '../src/**/*.js': ['browserify']
    },

    browserify: {
      debug: true,
      prodSourcemap: true,
      extensions: ['.js'],
      transform: [
        istanbul({
          instrumenter: isparta,
          instrumenterConfig: { embedSource: true },
          ignore: [
            '**/*.spec.js'
          ]
        }),
        'babelify', // Note: uses .babelrc
        'brfs'
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
        {
          type: 'html'
        },
        {
          type: 'text-summary'
        },
        {
          type: 'lcovonly'
        },
        {
          type: 'json'
        }
      ]
    },

    captureTimeout: 60000,
    browserDisconnectTimeout: 20000,
    browserNoActivityTimeout: 100000
  };

export default (config) => {

  config.set(karmaBaseConfig);

  if (process.env.TRAVIS) {
    if (!process.env.SAUCE_USERNAME || !process.env.SAUCE_ACCESS_KEY) {
      console.log('Make sure the SAUCE_USERNAME and SAUCE_ACCESS_KEY environment variables are set.')
      process.exit(1)
    }

    config.sauceLabs = {
      testName: 'angular-data-table unit tests',
      recordScreenshots: false,
      connectOptions: {
        port: 5757,
        logfile: 'sauce_connect.log'
      },
      public: 'public',
      tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER,
      startConnect: false
    };

    config.customLaunchers = customLaunchers;

    config.browsers = Object.keys(customLaunchers);

    config.reporters = ['progress', 'dots', 'coverage', 'saucelabs'];
    config.singleRun = true;

    config.coverageReporter.reporters = [
      {
        type: 'lcovonly'
      },
      {
        type: 'json'
      }
    ];
  }
};
