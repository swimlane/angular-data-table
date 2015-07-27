export function FooterDirective(){
  return {
    restrict: 'E',
    controller: 'FooterController',
    controllerAs: 'footer',
    bindToController: true,
    scope: {
      paging: '=',
      onPage: '&'
    },
    template:
      `<div class="dt-footer">
        <div class="page-count">{{footer.paging.count}} total</div>
        <dt-pager page="footerpage"
               size="footer.paging.size"
               count="footer.paging.count"
               on-page="footer.onPage(this, footer.page)"
               ng-show="footer.paging.count > 1">
         </dt-pager>
      </div>`,
    replace: true
  };
};
