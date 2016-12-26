import BodyController from './BodyController';
import SpecHelper from './BodyController.spechelper.json';
import { TableDefaults } from '../../defaults';

import '../../utils/polyfill';

fdescribe('BodyController', function () {
  const defaultOptions = {
      columns: [],
      paging: {}
    },
    olympicOptions = {
      columns: SpecHelper.Olympics.Columns,
      paging: {
        size: 0,
        count: 0,
        offset: 0
      }
    },
    olympicRows = SpecHelper.Olympics.Rows;;

  let scope = null,
    ctrl = null,
    setController = null;

  beforeEach(inject((_$rootScope_) => {
    setController = (options, rows = []) => {
      options = Object.assign({}, TableDefaults, options);

      scope = _$rootScope_.$new();

      scope.body = {
        options,
        rows
      };

      ctrl = new BodyController(scope);

      Object.assign(ctrl, {
        options,
        rows
      });
    };
  }));

  it('should export a function', () => {
    expect(BodyController).toEqual(jasmine.any(Function));
  });

  describe('when initializing', () => {
    it('should set ctrl', () => {
      setController(olympicOptions, olympicRows);

      spyOn(ctrl, 'setTreeAndGroupColumns');
      spyOn(ctrl, 'setConditionalWatches');

      ctrl.$onInit();

      expect(ctrl).not.toEqual({});
    });

    it('should set ctrl if under angular 1.5', () => {
      angular.version.major = 1;
      angular.version.minor = 4;

      setController(olympicOptions, olympicRows);

      spyOn(ctrl, 'setTreeAndGroupColumns');
      spyOn(ctrl, 'setConditionalWatches');

      expect(ctrl).not.toEqual({});
    });
  });

  describe('when setting tree and group columns', () => {
    beforeEach(() => {
      setController(olympicOptions, olympicRows);

      ctrl.$onInit();
    });

    it('should set the group column accurately', () => {
      expect(ctrl.groupColumn).toEqual(olympicOptions.columns[1])
    });

    it('should not set tree column', () => {
      expect(ctrl.treeColumn).toBe(undefined);
    });

    it('should not set tree or group column if options is not set', () => {
      ctrl.options = false;

      ctrl.treeColumn = false;
      ctrl.groupColumn = false;

      ctrl.setTreeAndGroupColumns();

      expect(ctrl.treeColumn).toBe(false);
      expect(ctrl.groupColumn).toBe(false);
    });

    it('should not set group column if a tree column is set', () => {
      ctrl.options.columns[0].isTreeColumn = true;

      ctrl.setTreeAndGroupColumns();

      expect(ctrl.treeColumn).toEqual(olympicOptions.columns[0]);
      expect(ctrl.groupColumn).not.toEqual(ctrl.options.columns[1]);
    });
  });

  describe('when setting conditional watches', () => {
    beforeEach(() => {
      setController(olympicOptions, olympicRows);

      ctrl.$onInit();
    });

    it('should not set watches when no vertical scrollbar or external paging', () => {
      ctrl.options.scrollbarV = false;
      ctrl.options.paging.externalPaging = false;

      ctrl.setConditionalWatches();

      expect(ctrl.watchListeners.length).toBe(0);
    });

    it('should set watches when vertical scrollbar', () => {
      ctrl.options.scrollbarV = true;

      ctrl.setConditionalWatches();

      expect(ctrl.watchListeners.length).toBe(3);
    });
  });
});
