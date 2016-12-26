import { PagerController } from './PagerController';

describe('PagerController', function () {
  let ctrl = null,
    scope = null,
    setController = null;

  beforeEach(inject((_$rootScope_) => {
    setController = (bindings) => {
      scope = _$rootScope_.$new();

      spyOn(scope, '$watch').and.callThrough();

      ctrl = new PagerController(scope);

      Object.assign(ctrl, bindings);
    };
  }));

  describe('when initializing', () => {
    beforeEach(() => {
      setController();

      ctrl.$onInit();
    });

    it('should call watch three times', () => {
      expect(ctrl.$scope.$watch.calls.count()).toEqual(3);
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

      expect(ctrl.selectPage).not.toHaveBeenCalled();
    });

    it('should select previous page if on first page', () => {
      ctrl.page = 3;

      ctrl.prevPage();

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

      expect(ctrl.selectPage).not.toHaveBeenCalled();
    });

    it('should select next page if not on last page', () => {
      ctrl.page = 3;
      ctrl.totalPages = 10;

      ctrl.nextPage();

      expect(ctrl.selectPage).toHaveBeenCalledWith(4);
    });
  });
});
