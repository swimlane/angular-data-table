import angular from 'angular';

export class CellController {

  constructor($scope){
    this.col = $scope.column;

    $scope.styles = {
      width: this.col.width  + 'px',
      height: this.col.height  + 'px'
    };
  }

};

export var CellDirective = function(){
  return {
    restrict: 'E',
    controller: 'CellController',
    controllerAs: 'cell',
    scope: {
      value: '=',
      column: '='
    },
    template: 
      `<div class="dt-cell" 
            data-title="{{::column.name}}" 
            ng-style="styles">
        {{value}}
      </div>`
  };
};
