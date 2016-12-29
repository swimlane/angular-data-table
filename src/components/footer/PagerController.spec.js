import { PagerController } from './PagerController';

import { TableDefaults } from '../../defaults';

describe('PagerController', function () {
  let ctrl = null,
    scope = null,
    setController = null;

  beforeEach(inject((_$rootScope_) => {
    setController = (bindings) => {
      bindings = Object.assign({}, TableDefaults.paging, bindings);

      scope = _$rootScope_.$new();

      scope.pager = bindings;

      spyOn(scope, '$watch');

      ctrl = new PagerController(scope);

      Object.assign(ctrl, bindings);
    };
  }));

  describe('when initializing', () => {
    const angularVersion = angular.copy(angular.version);

    beforeEach(() => {
      setController();

      ctrl.$onInit();
    });

    it('should call watch 3 times', () => {
      expect(ctrl.$scope.$watch.calls.count()).toEqual(3);
    });

    it('should call watch 3 times when under angular 1.5', () => {
      angular.version.major = 1;
      angular.version.minor = 4;

      setController();

      expect(ctrl.$scope.$watch.calls.count()).toEqual(3);

      angular.version = angularVersion;
    });
  });

  describe('when finding and setting pages', () => {
    beforeEach(() => {
      setController({
        size: 5,
        count: 50
      });

      ctrl.$onInit();

      spyOn(ctrl, 'calcTotalPages');
      spyOn(ctrl, 'getPages');

      ctrl.findAndSetPages();
    });

    it('should calculate total pages', () => {
      expect(ctrl.calcTotalPages).toHaveBeenCalledWith(5, 50);
    });

    it('should get pages', () => {
      expect(ctrl.getPages).toHaveBeenCalledWith(1);
    });
  });

  describe('when calculating total pages', () => {
    beforeEach(() => {
      setController({
        size: 5,
        count: 50
      });

      ctrl.$onInit();
    });

    it('should accurately set 10 total pages', () => {
      expect(ctrl.totalPages).toEqual(undefined);

      ctrl.calcTotalPages(5, 50);

      expect(ctrl.totalPages).toEqual(10);
    });

    it('should accurately set 11 total pages', () => {
      expect(ctrl.totalPages).toEqual(undefined);

      ctrl.calcTotalPages(5, 51);

      expect(ctrl.totalPages).toEqual(11);
    });

    it('should accurately set 5 total pages', () => {
      expect(ctrl.totalPages).toEqual(undefined);

      ctrl.calcTotalPages(50, 246);

      expect(ctrl.totalPages).toEqual(5);
    });

    it('should default total pages to 1 if no size', () => {
      ctrl.calcTotalPages(0, 5);

      expect(ctrl.totalPages).toEqual(1);
    });

    it('should default total pages to 1 if no count', () => {
      ctrl.calcTotalPages(5, 0);

      expect(ctrl.totalPages).toEqual(1);
    });
  });

  describe('when navigating to previous page', () => {
    beforeEach(() => {
      setController({
        size: 5,
        count: 50
      });

      ctrl.$onInit();

      spyOn(ctrl, 'selectPage');
    });

    it('should not select previous page if on first page', () => {
      ctrl.page = 1;

      ctrl.prevPage();

      expect(ctrl.canPrevious()).toEqual(false);
      expect(ctrl.selectPage).not.toHaveBeenCalled();
    });

    it('should select previous page if on first page', () => {
      ctrl.page = 3;

      ctrl.prevPage();

      expect(ctrl.canPrevious()).toEqual(true);
      expect(ctrl.selectPage).toHaveBeenCalledWith(2);
    });
  });

  describe('when navigating to next page', () => {
    beforeEach(() => {
      setController({
        size: 5,
        count: 50
      });

      ctrl.$onInit();

      spyOn(ctrl, 'selectPage');
    });

    it('should not select next page if on last page', () => {
      ctrl.page = 10;
      ctrl.totalPages = 10;

      ctrl.nextPage();

      expect(ctrl.canNext()).toEqual(false);
      expect(ctrl.selectPage).not.toHaveBeenCalled();
    });

    it('should select next page if not on last page', () => {
      ctrl.page = 3;
      ctrl.totalPages = 10;

      ctrl.nextPage();

      expect(ctrl.canNext()).toEqual(true);
      expect(ctrl.selectPage).toHaveBeenCalledWith(4);
    });
  });
});
