import angular from 'angular';

export class PagerController {

  /**
   * Creates an instance of the Pager Controller
   * @param  {object} $scope   
   */
  /*@ngInject*/
  constructor($scope){
    angular.extend(this, {
      size: $scope.size,
      count: $scope.count
    });

    this.totalPages = this.calcTotalPages();
    $scope.$watch('page', (newVal) => {
      if (newVal !== 0 && newVal <= this.totalPages) {
        this.getPages(newVal);
      }
    });
  }

  /**
   * Calculates the total number of pages given the count.
   * @return {int} page count
   */
  calcTotalPages() {
    var count = this.size < 1 ? 1 : 
      Math.ceil(this.count / this.size);
    return Math.max(count || 0, 1);
  }

  /**
   * Select a page
   * @param  {object} scope 
   * @param  {int} num   
   */
  selectPage(scope, num){
    if (num > 0 && num <= this.totalPages) {
      scope.page = num;
      scope.onPage({
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
    return scope.page !== 1;
  }

  /**
   * Determines if the pager can go forward
   * @param  {object} scope 
   * @return {boolean}       
   */
  canNext(scope){
    return scope.page <= this.totalPages;
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

export function PagerDirective(){
  return {
    restrict: 'E',
    controller: 'PagerController',
    controllerAs: 'pager',
    scope: {
      page: '=',
      size: '=',
      count: '=',
      onPage: '&'
    },
    template: 
      `<div class="dt-pager">
        <ul class="pager">
          <li ng-class="{ disabled: !pager.canPrevious(this) }">
            <a href ng-click="pager.selectPage(this, 1)" class="icon-left"></a>
          </li>
          <li ng-repeat="pg in pager.pages track by $index" ng-class="{ active: pg.active }">
            <a href ng-click="pager.selectPage(this, pg.number)">{{pg.text}}</a>
          </li>
          <li ng-class="{ disabled: !pager.canNext(this) }">
            <a href ng-click="pager.selectPage(this, pager.totalPages)" class="icon-right"></a>
          </li>
        </ul>
      </div>`,
    replace: true
  };
};
