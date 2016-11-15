import { DataTableController } from './DataTableController';

describe('DataTableController', function () {
  let $controller = null;

	beforeEach(() => {
		angular.module('DataTables.Mock', []);
    angular.mock.module('DataTables.Mock');
	});

  beforeEach(
    inject((_$controller_) => {
      $controller = _$controller_;
    })
  );

  it('should export a function', () => {
    expect(DataTableController).toEqual(jasmine.any(Function));
  });

  describe('', function () {

  });
});
