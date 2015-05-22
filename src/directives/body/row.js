import angular from 'angular';
import { ColumnsByPin } from 'utils/utils';
import { ColumnTotalWidth } from 'utils/math';

// Notes:
// http://stackoverflow.com/questions/14615534/custom-directive-like-ng-repeat
// width: 1200px; height: 50px; z-index: 0; transform: translate3d(0px, 21100px, 0px); 

export class RowController {
  constructor($scope){
    this.columnsByPin = ColumnsByPin($scope.options.columns);
  }

  styles(scope){
    return {
      height: scope.options.height + 'px'
    };
  }

  stylesByGroup(group){
   return {
      width: ColumnTotalWidth(group) + 'px'
    };
  }
};

export var RowDirective = function(){

  return {
    restrict: 'E',
    controller: 'RowController',
    controllerAs: 'row',
    scope: {
      options: '=',
      value: '=',
      index: '='
    },
    template: `
      <div class="dt-row" tabindex="-1" ng-style="row.styles(this)">
        <div class="dt-row-left" ng-style="row.stylesByGroup(row.columnsByPin.left)">
          <dt-cell ng-repeat="column in row.columnsByPin.left track by $index"
                   column="column" 
                   value="value"></dt-header-cell>
        </div>
        <div class="dt-row-center" ng-style="row.stylesByGroup(row.columnsByPin.center)">
          <dt-cell ng-repeat="column in row.columnsByPin.center track by $index"
                   column="column" 
                   value="value"></dt-header-cell>
        </div>
        <div class="dt-row-right" ng-style="row.stylesByGroup(row.columnsByPin.right)">
          <dt-cell ng-repeat="column in row.columnsByPin.right track by $index" 
                   column="column" 
                   value="value"></dt-cell>
        </div>
      </div>`,
    replace:true
  };
};
