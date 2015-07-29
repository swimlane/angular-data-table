export class PagerController {

  /**
   * Creates an instance of the Pager Controller
   * @param  {object} $scope
   */
  /*@ngInject*/
  constructor($scope){
    $scope.$watch('pager.count', (newVal) => {
      this.calcTotalPages($scope.pager.size, $scope.pager.count);
      this.getPages($scope.page || 1);
    });

    $scope.$watch('pager.page', (newVal) => {
      if (newVal !== 0 && newVal <= this.totalPages) {
        this.getPages(newVal);
      }
    });

    this.getPages($scope.pager.page || 1);
  }

  /**
   * Calculates the total number of pages given the count.
   * @return {int} page count
   */
  calcTotalPages(size, count) {
    var count = size < 1 ? 1 : Math.ceil(count / size);
    this.totalPages = Math.max(count || 0, 1);
  }

  /**
   * Select a page
   * @param  {object} scope
   * @param  {int} num
   */
  selectPage(scope, num){
    if (num > 0 && num <= this.totalPages) {
      scope.pager.page = num;
      scope.pager.onPage({
        page: num
      });
    }
  }

  /**
   * Determines if the pager can go previous
   * @param  {scope} scope
   * @return {boolean}
   */
  canPrevious(scope){
    return scope.pager.page !== 1;
  }

  /**
   * Determines if the pager can go forward
   * @param  {object} scope
   * @return {boolean}
   */
  canNext(scope){
    return scope.pager.page <= this.totalPages;
  }

  /**
   * Gets the page set given the current page
   * @param  {int} page
   */
  getPages(page) {
    var pages = [],
        startPage = 1,
        endPage = this.totalPages,
        maxSize = 5,
        isMaxSized = maxSize < this.totalPages;

    if (isMaxSized) {
      startPage = ((Math.ceil(page / maxSize) - 1) * maxSize) + 1;
      endPage = Math.min(startPage + maxSize - 1, this.totalPages);
    }

    for (var number = startPage; number <= endPage; number++) {
      pages.push({
        number: number,
        text: number,
        active: number === page
      });
    }

    if (isMaxSized) {
      if (startPage > 1) {
        pages.unshift({
          number: startPage - 1,
          text: '...'
        });
      }

      if (endPage < this.totalPages) {
        pages.push({
          number: endPage + 1,
          text: '...'
        });
      }
    }

    this.pages = pages;
  }

};
