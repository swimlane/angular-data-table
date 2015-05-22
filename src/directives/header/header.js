import angular from 'angular';
import { ColumnsByPin } from 'utils/utils';
import { ColumnTotalWidth } from 'utils/math';

export class HeaderController {
  constructor($scope){
    this.columnsByPin = ColumnsByPin($scope.options.columns);
  }

  styles(scope) {
    return {
      width: scope.options.cache.innerWidth + 'px',
      height: scope.options.headerHeight + 'px'
    }
  }
};

export var HeaderDirective = function(){

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
          <dt-header-cell ng-repeat="column in header.columnsByPin.left track by $index" 
                          column="column"></dt-header-cell>
        </div>
        <div class="dt-row-center">
          <dt-header-cell ng-repeat="column in header.columnsByPin.center track by $index" 
                          column="column"></dt-header-cell>
        </div>
        <div class="dt-row-right">
          <dt-header-cell ng-repeat="column in header.columnsByPin.right track by $index" 
                          column="column"></dt-header-cell>
        </div>
      </div>`,
    replace:true,
    link: function(){
      
    }
  };
};
