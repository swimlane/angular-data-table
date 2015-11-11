import { PagerController } from './PagerController';

export function PagerDirective(){
  return {
    restrict: 'E',
    controller: PagerController,
    controllerAs: 'pager',
    scope: true,
    bindToController: {
      page: '=',
      size: '=',
      count: '=',
      onPage: '&'
    },
    template:
      `<div class="dt-pager">
        <ul class="pager">
          <li ng-class="{ disabled: !pager.canPrevious() }">
            <a href ng-click="pager.selectPage(1)" class="icon-prev"></a>
          </li>
          <li ng-class="{ disabled: !pager.canPrevious() }">
            <a href ng-click="pager.prevPage()" class="icon-left"></a>
          </li>
          <li ng-repeat="pg in pager.pages track by $index" ng-class="{ active: pg.active }">
            <a href ng-click="pager.selectPage(pg.number)">{{pg.text}}</a>
          </li>
          <li ng-class="{ disabled: !pager.canNext() }">
            <a href ng-click="pager.nextPage()" class="icon-right"></a>
          </li>
          <li ng-class="{ disabled: !pager.canNext() }">
            <a href ng-click="pager.selectPage(pager.totalPages)" class="icon-skip"></a>
          </li>
        </ul>
      </div>`,
    replace: true
  };
};
