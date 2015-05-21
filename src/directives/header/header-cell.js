import angular from 'angular';
 
export var HeaderCellController = function($scope){
  var col = $scope.column;

  $scope.styles = {
    width: col.width,
    minWidth: col.minWidth,
    maxWidth: col.maxWidth,
    height: col.height
  };
}

export var HeaderCellDirective = function(){
  return {
    restrict: 'E',
    controller: 'HeaderCellController',
    scope: {
      column: '='
    },
    template: 
      `<div class="dt-header-cell" ng-style="styles">
        {{::column.name}}
      </div>`,
    link: function($scope, $elm, $attrs){

      $elm.on('dblclick', () => {
        $scope.column.selected = true;
      });

    }
  };
};
