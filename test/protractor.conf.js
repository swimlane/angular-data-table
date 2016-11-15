const config = {
  framework: 'jasmine',
  specs: ['../src/**/*e2e.js']
};

if (process.env.TRAVIS) {
  config.seleniumAddress = 'http://localhost:4445/wd/hub';
  config.capabilities = {
    'username': process.env.SAUCE_USERNAME,
    'accessKey': process.env.SAUCE_ACCESS_KEY,
    'name': 'angular-data-table e2e tests',
    'browserName': 'chrome',
    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
    'build': process.env.TRAVIS_BUILD_NUMBER
  };
} else {
  config.seleniumAddress = 'http://localhost:4444/wd/hub';
}

exports.config = config;
