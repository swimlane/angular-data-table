import angular from 'angular';
import { ColumnsByPin } from 'utils/utils';
import { ColumnTotalWidth } from 'utils/math';

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

  getValue(scope, col){
    return scope.value[col.prop];
  }
};

export var RowDirective = function(){

  return {
    restrict: 'E',
    controller: 'RowController',
    controllerAs: 'row',
    replace: true,
    scope: {
      options: '=',
      value: '='
    },
    template: `
      <div class="dt-row" tabindex="-1" ng-style="row.styles(this)">
        <div class="dt-row-left" ng-style="row.stylesByGroup(row.columnsByPin.left)">
          <dt-cell ng-repeat="column in row.columnsByPin.left track by $index"
                   column="column" 
                   value="row.getValue(this, column)"></dt-header-cell>
        </div>
        <div class="dt-row-center" ng-style="row.stylesByGroup(row.columnsByPin.center)">
          <dt-cell ng-repeat="column in row.columnsByPin.center track by $index"
                   column="column" 
                   value="row.getValue(this, column)"></dt-header-cell>
        </div>
        <div class="dt-row-right" ng-style="row.stylesByGroup(row.columnsByPin.right)">
          <dt-cell ng-repeat="column in row.columnsByPin.right track by $index" 
                   column="column" 
                   value="row.getValue(this, column)"></dt-cell>
        </div>
      </div>`,
    replace:true
  };
};
