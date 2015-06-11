import angular from 'angular';

export class FooterController {

  /**
   * Creates an instance of the Footer Controller
   * @param  {scope}
   * @return {[type]}
   */
  /*@ngInject*/
  constructor($scope){
    this.$scope = $scope;
    $scope.page = $scope.paging.offset + 1;
    $scope.$watch('paging.offset', this.offsetChanged.bind(this));
  }

  /**
   * The offset ( page ) changed externally, update the page
   * @param  {new offset}
   */
  offsetChanged(newVal){
    this.$scope.page = newVal + 1;
  }

  /**
   * The pager was invoked
   * @param  {scope}
   */
  pageChanged(scope){
    scope.paging.offset = scope.page - 1;
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
        <pagination direction-links="true"
                    boundary-links="true"
                    items-per-page="paging.size"
                    total-items="paging.count"
                    ng-show="paging.count > 1"
                    ng-change="footer.pageChanged(this)"
                    previous-text="&lsaquo;"
                    next-text="&rsaquo;"
                    first-text="&laquo;"
                    last-text="&raquo;"
                    rotate="false"
                    max-size="5"
                    ng-model="page">
        </pagination>
      </div>`,
    replace: true
  };
};
