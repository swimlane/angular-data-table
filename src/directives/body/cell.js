import angular from 'angular';

export class CellController {

  styles(col){
    return {
      width: col.width  + 'px',
      height: col.height  + 'px'
    };
  }

  treeClass(){
    return {
      'dt-tree-toggle': true,
      'icon-down': !this.expanded,
      'icon-up': this.expanded
    }
  }

  onTreeToggle(evt, scope){
    evt.stopPropagation();
    this.expanded = !this.expanded;
    scope.onTreeToggle({ 
      cell: {
        value: scope.value,
        column: scope.column,
        expanded: this.expanded
      }
    });
  }

};

export function CellDirective($rootScope, $compile, $log){
  return {
    restrict: 'E',
    controller: 'CellController',
    controllerAs: 'cell',
    scope: {
      value: '=',
      column: '=',
      onTreeToggle: '&'
    },
    template: 
      `<div class="dt-cell" 
            data-title="{{::column.name}}" 
            ng-style="cell.styles(column)">
        <span ng-if="column.isTreeColumn"
              ng-class="cell.treeClass()"
              ng-click="cell.onTreeToggle($event, this)"></span>
        <span class="dt-cell-content"></span>
      </div>`,
    replace: true,
    compile: function() {
      return {
        pre: function($scope, $elm, $attrs, ctrl) {
          var content = angular.element($elm[0].querySelector('.dt-cell-content'));
          
          $scope.$watch('value', () => {
            content.empty();
            
            if($scope.column.cellRenderer){
              var elm = angular.element($scope.column.cellRenderer($scope));
              content.append($compile(elm)($scope));
            } else {
              var val = $scope.column.cellDataGetter ? 
                $scope.column.cellDataGetter($scope.value) : $scope.value;

              if(val === undefined || val === null) val = '';

              content[0].innerHTML = val;
            }
          });
        }
      }
    }
  };
};
