const mainModule = 'data-table';

angular.module(mainModule + '.mocks', ['ngMock']);

beforeEach(function () {
  // angular.module(mainModule, [])
  //   .controller('BodyController', BodyController);

  // Load the application module and the mock module for all tests
  angular.mock.module(mainModule, mainModule + '.mocks');
});
