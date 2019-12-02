import { FooterController } from './FooterController';

export function FooterDirective(){
  return {
    restrict: 'E',
    controller: FooterController,
    controllerAs: 'footer',
    scope: true,
    bindToController: {
      paging: '=',
      onPage: '&'
    },
    template:
      `<div class="dt-footer">
        <div class="page-count" ng-bind="footer.paging.countText ? footer.paging.countText(footer.paging.count) : ''"></div>
        <dt-pager page="footer.page"
               size="footer.paging.size"
               count="footer.paging.count"
               on-page="footer.onPaged(page)"
               ng-show="footer.paging.count / footer.paging.size > 1">
         </dt-pager>
      </div>`,
    replace: true
  };
};
