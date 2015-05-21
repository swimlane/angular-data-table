import angular from 'angular';

export var CellController = function($scope){
  var col = $scope.column;

  $scope.styles = {
    width: col.width,
    height: col.height
  };

  $scope.classes = {
    'highlight': col.selected
  };

};

export var CellDirective = function(){
  return {
    restrict: 'E',
    controller: 'CellController',
    scope: {
      value: '=',
      column: '='
    },
    template: 
      `<div class="dt-cell" 
            ng-class="classes"
            data-title="{{::column.name}}" 
            ng-style="styles">
        {{::value[column.prop]}}
      </div>`,
    link: function($scope, $elm, $attrs){
      console.log('cell')
    }
  };
};
