import angular from 'angular';

export class CellController {

  constructor($scope){
    this.col = $scope.column;

    $scope.styles = {
      width: this.col.width  + 'px',
      height: this.col.height  + 'px'
    };
  }
  
  isSelected(){
    return {
      'highlight': this.col.selected
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
            ng-class="cell.isSelected()"
            data-title="{{::column.name}}" 
            ng-style="styles">
        {{value}}
      </div>`,
    link: function($scope, $elm, $attrs){
      //
    }
  };
};
