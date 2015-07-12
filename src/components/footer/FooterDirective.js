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
        <dt-pager page="page"
               size="paging.size"
               count="paging.count"
               on-page="footer.onPage(this, page)"
               ng-show="paging.count > 1">
         </dt-pager>
      </div>`,
    replace: true
  };
};
