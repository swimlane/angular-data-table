import angular from 'angular';

export class CellController {

  styles(col){
    return {
      width: col.width  + 'px',
      height: col.height  + 'px'
    };
  }

};

export function CellDirective($rootScope, $compile, $log){
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
            ng-style="cell.styles(column)">
      </div>`,
    replace: true,
    compile: function() {
      return {
        pre: function($scope, $elm, $attrs, ctrl) {
          if($scope.column.cellRenderer){
            var elm = angular.element($scope.column.cellRenderer($scope, $elm));
            $elm.append($compile(elm)($scope));
          } else if($scope.column.cellDataGetter) {
            var val = $scope.column.cellDataGetter($scope.value);

            if(!angular.isString(val)) {
              $log.error('Column values must be of type string');
              return;
            }

            $elm.append(val);
          } else {
            $elm.append($scope.value);
          }
        }
      }
    }
  };
};
