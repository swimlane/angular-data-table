import angular from 'angular';

export class FooterController {

  /**
   * Creates an instance of the Footer Controller
   * @param  {scope}
   * @return {[type]}
   */
  /*@ngInject*/
  constructor($scope){
    $scope.page = $scope.paging.offset + 1;
    $scope.$watch('paging.offset', (newVal) => {
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
    scope.paging.offset = page - 1;
    scope.onPage({
      offset: scope.paging.offset,
      size: scope.paging.size
    });
  }

};

export function FooterDirective(){
  return {
    restrict: 'E',
    controller: 'FooterController',
    controllerAs: 'footer',
    scope: {
      paging: '=',
      onPage: '&'
    },
    template: 
      `<div class="dt-footer">
        <div class="page-count">{{paging.count}} total</div>
        <pager page="page"
               size="paging.size"
               count="paging.count"
               on-page="footer.onPage(this, page)"
               ng-show="paging.count > 1">
         </pager>
      </div>`,
    replace: true
  };
};
