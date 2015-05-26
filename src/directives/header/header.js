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
        <div class="dt-row-left">
          <dt-header-cell ng-repeat="column in options.columns | filter: { frozenLeft: true }" 
                          column="column"></dt-header-cell>
        </div>
        <div class="dt-row-center">
          <dt-header-cell ng-repeat="column in options.columns | filter: { frozenLeft: false, frozenRight: false }" 
                          column="column"></dt-header-cell>
        </div>
        <div class="dt-row-right">
          <dt-header-cell ng-repeat="column in options.columns | filter: { frozenRight: true }" 
                          column="column"></dt-header-cell>
        </div>
      </div>`,
    replace:true,
    link: function($scope, $elm, $attrs){

      function sorted(s){
        var col = angular.element(s).scope().column,
            idx = $scope.options.columns.indexOf(col),
            parent = angular.element(s).parent(),
            newIdx = -1;

        angular.forEach(parent.children(), (c, i) => {
          if(s === c){
            newIdx = i;
          }
        });

        $timeout(() => {
          $scope.options.columns.splice(idx, 1);
          $scope.options.columns.splice(newIdx, 0, col);
        });
      }

      // setup sortables
      $timeout(() => {
        angular.forEach($elm.children(), (e) => {
          Sortable(e, sorted);
        });
      }, 10);

    }
  };
};
