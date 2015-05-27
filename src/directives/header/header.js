import angular from 'angular';
import { ColumnTotalWidth } from 'utils/math';
import { Sortable } from 'utils/sortable';

export class HeaderController {

  styles(scope) {
    return {
      width: scope.options.cache.innerWidth + 'px',
      height: scope.options.headerHeight + 'px'
    }
  }

  innerStyles(scope){
    return {
      width: ColumnTotalWidth(scope.options.columns) + 'px',
      transform: `translate3d(-${scope.options.cache.offsetX}px, 0, 0)`
    };
  }

};

export function HeaderDirective($timeout){

  return {
    restrict: 'E',
    controller: 'HeaderController',
    controllerAs: 'header',
    scope: {
      options: '='
    },
    template: `
      <div class="dt-header" ng-style="header.styles(this)">
        <div class="dt-header-inner" ng-style="header.innerStyles(this)">
          <div class="dt-row-left" 
               sortable="options.reorderable"
               on-sort="sorted(event, childScope)">
            <dt-header-cell ng-repeat="column in options.columns | filter: { frozenLeft: true }" 
              column="column"></dt-header-cell>
          </div>
          <div class="dt-row-center" 
               sortable="options.reorderable"
               on-sort="sorted(event, childScope)">
            <dt-header-cell ng-repeat="column in options.columns | filter: { frozenLeft: false, frozenRight: false }" 
              column="column"></dt-header-cell>
          </div>
          <div class="dt-row-right"
               sortable="options.reorderable"
               on-sort="sorted(event, childScope)">
            <dt-header-cell ng-repeat="column in options.columns | filter: { frozenRight: true }" 
              column="column"></dt-header-cell>
          </div>
        </div>
      </div>`,
    replace:true,
    link: function($scope, $elm, $attrs){

      $scope.sorted = function(event, childScope){
        var col = childScope.column,
            idx = $scope.options.columns.indexOf(col),
            parent = angular.element(event.currentTarget),
            newIdx = -1;

        angular.forEach(parent.children(), (c, i) => {
          if(childScope === angular.element(c).scope()){
            newIdx = i;
          }
        });

        $timeout(() => {
          $scope.options.columns.splice(idx, 1);
          $scope.options.columns.splice(newIdx, 0, col);
        });
      }

    }
  };
};
