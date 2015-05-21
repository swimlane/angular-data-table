import angular from 'angular';
 
export class HeaderCellController{
  constructor($scope){
    this.col = $scope.column;

    $scope.styles = {
      width: this.col.width  + 'px',
      minWidth: this.col.minWidth  + 'px',
      maxWidth: this.col.maxWidth  + 'px',
      height: this.col.height  + 'px'
    };
  }

  isSelected(){
    return {
      'highlight': this.col.selected
    };
  }
}

export var HeaderCellDirective = function($timeout){
  return {
    restrict: 'E',
    controller: 'HeaderCellController',
    controllerAs: 'hcell',
    scope: {
      column: '='
    },
    template: 
      `<div class="dt-header-cell" 
            ng-class="hcell.isSelected()"
            ng-style="styles">
        {{::column.name}}
      </div>`,
    link: function($scope, $elm, $attrs){

      $elm.on('dblclick', () => {
        $timeout(() => {
          $scope.column.selected = !$scope.column.selected;
        });
      });

      $elm.on('click', () => {
        if($scope.column.sortable){

        }
      });

      $scope.$on('$destroy', () => {
        $elm.off('dblclick click');
      });

    }
  };
};
