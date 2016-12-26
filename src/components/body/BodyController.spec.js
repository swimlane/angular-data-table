import BodyController from './BodyController';
import SpecHelper from './BodyController.spechelper.json';

describe('BodyController', function () {
  const defaultOptions = {
    columns: [],
    paging: {}
  };

  let $scope = null,
    ctrl = null,
    setCtrl = null;

  beforeEach(() => {
    angular.module('DataTables.Mock', []);
    angular.mock.module('DataTables.Mock');
  });

  beforeEach(
    inject((_$rootScope_) => {

      setCtrl = (options = defaultOptions, rows = []) => {
        $scope = _$rootScope_.$new();

        $scope.body = {
          options: defaultOptions,
          rows: []
        };

        ctrl = new BodyController($scope);

        $scope.body.options = options;
        $scope.body.rows = rows;

        ctrl.options = options;
        ctrl.rows = rows;
      };
    })
  );

  it('should export a function', () => {
    expect(BodyController).toEqual(jasmine.any(Function));
  });

  describe('when initializing', () => {
    const options = {
        columns: SpecHelper.Olympics.Columns,
        paging: {
          size: 0,
          count: 0,
          offset: 0
        }
      },
      rows = SpecHelper.Olympics.Rows;

    it('should not be empty', () => {
      setCtrl(options, rows);

      expect(ctrl).not.toBe({});
    });
  })
});
