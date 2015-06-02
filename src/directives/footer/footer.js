import angular from 'angular';

export class FooterController {
};

export function FooterDirective(){
  return {
    restrict: 'E',
    controller: 'FooterController',
    controllerAs: 'footer',
    scope: {
      paging: '='
    },
    template: 
      `<div class="dt-footer">
        <div class="page-count">{{paging.count}} total</div>
        <pagination direction-links="true"
                    boundary-links="true"
                    items-per-page="paging.pageSize"
                    total-items="paging.count"
                    ng-show="paging.count > 1"
                    previous-text="&lsaquo;"
                    next-text="&rsaquo;"
                    first-text="&laquo;"
                    last-text="&raquo;"
                    rotate="false"
                    max-size="5"
                    ng-model="paging.page">
        </pagination>
      </div>`,
    replace: true
  };
};
