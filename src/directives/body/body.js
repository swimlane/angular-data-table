import angular from 'angular';
import { ColumnTotalWidth } from 'utils/math';

// Notes:
// http://stackoverflow.com/questions/14615534/custom-directive-like-ng-repeat

export class BodyController{
  constructor($scope){

    console.log($scope.selectez)

    angular.extend(this, {
      data: $scope.values,
      options: $scope.options,
      selected: $scope.selected
    });

    $scope.styles = {
      //ColumnTotalWidth($scope.options.columns) + 'px'
      width: $scope._innerWidth 
    };
  }

  limit(){
    if(!this.options.scrollbarV){
      return this.data.length;
    } else {
      // todo
      return 100;
    }
  }

  isSelected(row){
    var selected = false;

    if(this.options.selectable){
      if(this.options.multiSelect){
        selected = this.selected.indexOf(row) > -1;
      } else {
        selected = this.selected === row;
      }
    }

    return {
      'selected': selected
    }
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
      options: '=',
      selected: '='
    },
    template: `
      <div class="dt-body">
        <dt-row ng-repeat="r in values track by $index | limitTo: body.limit()" 
                value="r"
                ng-click="body.rowClicked(r)"
                columns="options.columns"
                ng-class="body.isSelected(r)"
                ng-style="styles">
        </dt-row>
      </div>`,
    replace:true
  };
};
