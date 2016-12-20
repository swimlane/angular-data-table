import BodyController from './BodyController';

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
        columns: [
          { name: 'Athlete', prop: 'athlete', width: 300 },
          { name: 'Country', prop: 'country', group: true },
          { name: 'Year', prop: 'year' },
          { name: 'Sport', prop: 'sport' }
        ],
        paging: {
          size: 0,
          count: 0,
          offset: 0
        }
      },
      rows = [
        {'athlete':'Michael Phelps','age':19,'country':'United States','year':2004,'date':'29/08/2004','sport':'Swimming','gold':6,'silver':0,'bronze':2,'total':8},
        {'athlete':'Michael Phelps','age':27,'country':'United States','year':2012,'date':'12/08/2012','sport':'Swimming','gold':4,'silver':2,'bronze':0,'total':6},
        {'athlete':'Natalie Coughlin','age':25,'country':'United States','year':2008,'date':'24/08/2008','sport':'Swimming','gold':1,'silver':2,'bronze':3,'total':6},
        {'athlete':'Aleksey Nemov','age':24,'country':'Russia','year':2000,'date':'01/10/2000','sport':'Gymnastics','gold':2,'silver':1,'bronze':3,'total':6},
        {'athlete':'Alicia Coutts','age':24,'country':'Australia','year':2012,'date':'12/08/2012','sport':'Swimming','gold':1,'silver':3,'bronze':1,'total':5},
        {'athlete':'Missy Franklin','age':17,'country':'United States','year':2012,'date':'12/08/2012','sport':'Swimming','gold':4,'silver':0,'bronze':1,'total':5}
      ];

    it('should not be empty', () => {
      setCtrl(options, rows);

      expect(ctrl).not.toBe({});
    });
  })
});
