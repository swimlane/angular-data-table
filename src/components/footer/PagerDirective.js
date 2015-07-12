import angular from 'angular';

export function PagerDirective(){
  return {
    restrict: 'E',
    controller: 'PagerController',
    controllerAs: 'pager',
    scope: {
      page: '=',
      size: '=',
      count: '=',
      onPage: '&'
    },
    template: 
      `<div class="dt-pager">
        <ul class="pager">
          <li ng-class="{ disabled: !pager.canPrevious(this) }">
            <a href ng-click="pager.selectPage(this, 1)" class="icon-left"></a>
          </li>
          <li ng-repeat="pg in pager.pages track by $index" ng-class="{ active: pg.active }">
            <a href ng-click="pager.selectPage(this, pg.number)">{{pg.text}}</a>
          </li>
          <li ng-class="{ disabled: !pager.canNext(this) }">
            <a href ng-click="pager.selectPage(this, pager.totalPages)" class="icon-right"></a>
          </li>
        </ul>
      </div>`,
    replace: true
  };
};
