import angular from 'angular';
import { ColumnTotalWidth } from 'utils/math';

// Notes:
// http://stackoverflow.com/questions/14615534/custom-directive-like-ng-repeat

export class BodyController{
  constructor($scope){
    angular.extend(this, {
      limit: 50,
      options: $scope.options,
      selected: $scope.selected
    });

    $scope.styles = {
      width: ColumnTotalWidth($scope.options.columns) + 'px'
    };
  }

  rowClicked(row){
    if(this.options.selectable){
      if(this.options.multiSelect){
        var idx = this.selected.indexOf(row);
        if(idx > -1){
          this.selected.splice(idx, 1);
        } else {
          this.selected.push(row);
        }
      } else {
        this.selected = row;
      }
    }
  }
}

export var BodyDirective = function(){

  return {
    restrict: 'E',
    controller: 'BodyController',
    controllerAs: 'body',
    scope: {
      values: '=',
      options: '='
    },
    template: `
      <div class="dt-body">
        <dt-row ng-repeat="r in values track by $index | limitTo: body.limit" 
                value="r"
                ng-click="body.rowClicked(r)"
                columns="options.columns"
                ng-style="styles">
        </dt-row>
      </div>`,
    replace:true
  };
};
