import angular from 'angular';
import { ColumnsByPin } from 'utils/utils';

// Notes:
// http://stackoverflow.com/questions/14615534/custom-directive-like-ng-repeat

// width: 1200px; height: 50px; z-index: 0; transform: translate3d(0px, 21100px, 0px); 

export var RowController = function($scope){
  $scope.columnsByPin = ColumnsByPin($scope.columns);

  $scope.styles = {
    //width: 
  };
};

export var RowDirective = function(){

  return {
    restrict: 'E',
    controller: 'RowController',
    scope: {
      value: '=',
      columns: '=',
      index: '='
    },
    template: `
      <div class="dt-row" tabindex="-1" ng-style="styles">
        <div class="dt-row-left">
          <dt-cell ng-repeat="column in columnsByPin.left track by $index"
                   column="column" 
                   value="value"></dt-header-cell>
        </div>
        <div class="dt-row-center">
          <dt-cell ng-repeat="column in columnsByPin.center track by $index"
                   column="column" 
                   value="value"></dt-header-cell>
        </div>
        <div class="dt-row-right">
          <dt-cell ng-repeat="column in columnsByPin.right track by $index" 
                   column="column" 
                   value="value"></dt-cell>
        </div>
      </div>`,
    replace:true
  };
};
