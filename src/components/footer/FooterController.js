export class FooterController {

  /**
   * Creates an instance of the Footer Controller
   * @param  {scope}
   * @return {[type]}
   */
  /*@ngInject*/
  constructor($scope){
    $scope.page = $scope.footer.paging.offset + 1;
    $scope.$watch('footer.paging.offset', (newVal) => {
      this.offsetChanged($scope, newVal)
    });
  }

  /**
   * The offset ( page ) changed externally, update the page
   * @param  {new offset}
   */
  offsetChanged(scope, newVal){
    scope.page = newVal + 1;
  }

  /**
   * The pager was invoked
   * @param  {scope}
   */
  onPage(scope, page){
    scope.footer.paging.offset = page - 1;
    scope.footer.onPage({
      offset: scope.footer.paging.offset,
      size: scope.footer.paging.size
    });
  }

};
