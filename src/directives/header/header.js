import angular from 'angular';
import { ColumnsByPin } from 'utils/utils';
import { ColumnTotalWidth } from 'utils/math';

export var HeaderController = function($scope){
  $scope.columnsByPin = ColumnsByPin($scope.columns);

  $scope.styles = {
    width: $scope._innerWidth //ColumnTotalWidth($scope.columns) + 'px'
  }
};

export var HeaderDirective = function(){

  return {
    restrict: 'E',
    controller: 'HeaderController',
    scope: {
      columns: '='
    },
    template: `
      <div class="dt-header" ng-style="styles">
        <div class="dt-row-left">
          <dt-header-cell ng-repeat="column in columnsByPin.left track by $index" 
                          column="column"></dt-header-cell>
        </div>
        <div class="dt-row-center">
          <dt-header-cell ng-repeat="column in columnsByPin.center track by $index" 
                          column="column"></dt-header-cell>
        </div>
        <div class="dt-row-right">
          <dt-header-cell ng-repeat="column in columnsByPin.right track by $index" 
                          column="column"></dt-header-cell>
        </div>
      </div>`,
    replace:true,
    link: function(){
      
    }
  };
};
