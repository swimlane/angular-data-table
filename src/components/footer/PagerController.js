export class PagerController {

  /**
   * Creates an instance of the Pager Controller
   * @param  {object} $scope   
   */
  /*@ngInject*/
  constructor($scope){
    $scope.$watch('pager.count', (newVal) => {
      this.calcTotalPages(this.size, this.count);
      this.getPages(this.page || 1);
    });

    $scope.$watch('pager.size', (newVal) => {
      this.calcTotalPages(this.size, this.count);
      this.getPages(this.page || 1);
    });

    $scope.$watch('pager.page', (newVal) => {
      if (newVal !== 0 && newVal <= this.totalPages) {
        this.getPages(newVal);
      }
    });
    
    this.getPages(this.page || 1);
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
   * @param  {int} num   
   */
  selectPage(num){
    if (num > 0 && num <= this.totalPages) {
      this.page = num;
      this.onPage({
        page: num
      });
    }
  }

  /**
   * Selects the previous pager
   */
  prevPage(){
    if (this.page > 1) {
      this.selectPage(--this.page);
    }
  }

  /**
   * Selects the next page
   */
  nextPage(){
    this.selectPage(++this.page);
  }

  /**
   * Determines if the pager can go previous
   * @return {boolean}
   */
  canPrevious(){
    return this.page > 1;
  }

  /**
   * Determines if the pager can go forward
   * @return {boolean}       
   */
  canNext(){
    return this.page < this.totalPages;
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

    /*
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
    */

    this.pages = pages;
  }

};
