export class FooterController {

  /**
   * Creates an instance of the Footer Controller
   * @param  {scope}
   * @return {[type]}
   */
  /*@ngInject*/
  constructor($scope){
    this.page = this.paging.offset + 1;
    $scope.$watch('footer.paging.offset', (newVal) => {
      this.offsetChanged(newVal)
    });
  }

  /**
   * The offset ( page ) changed externally, update the page
   * @param  {new offset}
   */
  offsetChanged(newVal){
    this.page = newVal + 1;
  }

  /**
   * The pager was invoked
   * @param  {scope}
   */
  onPaged(page){
    this.paging.offset = page - 1;
    this.onPage({
      offset: this.paging.offset,
      size: this.paging.size
    });
  }

};
