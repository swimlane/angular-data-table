import angular from 'angular';
import { ColumnTotalWidth } from 'utils/math';

export class RowController {

  stylesByGroup(scope, group){
   var cols = scope.options.columns.filter((c) => {
      if(group === 'left' && c.frozenLeft){
        return c;
      } else if(group === 'right' && c.frozenRight){
        return c;
      } else if(group === 'center') {
        return c;
      }
   });

   var styles = {
      width: ColumnTotalWidth(cols) + 'px'
    };

    if(group === 'center'){
      //styles['transform'] = `translate3d(${-scope.options.cache.offsetX}px, 0, 0)`
    }

    return styles;
  }

  getValue(scope, col){
    return scope.value[col.prop];
  }
};

export function RowDirective(){

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
      <div class="dt-row">
        <div class="dt-row-left" ng-style="row.stylesByGroup(this, 'left')">
          <dt-cell ng-repeat="column in options.columns | filter: { frozenLeft: true } track by $index"
                   column="column" 
                   value="row.getValue(this, column)"></dt-header-cell>
        </div>
        <div class="dt-row-center" ng-style="row.stylesByGroup(this, 'center')">
          <dt-cell ng-repeat="column in options.columns | filter: { frozenLeft: false, frozenRight: false } track by $index"
                   column="column" 
                   value="row.getValue(this, column)"></dt-header-cell>
        </div>
        <div class="dt-row-right" ng-style="row.stylesByGroup(this, 'right')">
          <dt-cell ng-repeat="column in options.columns | filter: { frozenRight: true } track by $index" 
                   column="column" 
                   value="row.getValue(this, column)"></dt-cell>
        </div>
      </div>`,
    replace:true
  };
};
