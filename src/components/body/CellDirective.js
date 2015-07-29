import angular from 'angular';

export function CellDirective($rootScope, $compile, $log){
  return {
    restrict: 'E',
    controller: 'CellController',
    controllerAs: 'cell',
    bindToController: true,
    scope: {
      options: '=',
      value: '=',
      selected: '=',
      column: '=',
      row: '=',
      expanded: '=',
      hasChildren: '=',
      onTreeToggle: '&',
      onCheckboxChange: '&'
    },
    template:
      `<div class="dt-cell"
            data-title="{{::column.name}}"
            ng-style="cell.styles()"
            ng-class="cell.cellClass()">
        <label ng-if="column.isCheckboxColumn" class="dt-checkbox">
          <input type="checkbox"
                 ng-checked="selected"
                 ng-click="cell.onCheckboxChange($event, this)" />
        </label>
        <span ng-if="column.isTreeColumn && hasChildren"
              ng-class="cell.treeClass(this)"
              ng-click="cell.onTreeToggle($event, this)"></span>
        <span class="dt-cell-content"></span>
      </div>`,
    replace: true,
    compile: function() {
      return {
        pre: function($scope, $elm, $attrs, ctrl) {
          var content = angular.element($elm[0].querySelector('.dt-cell-content')),
              cellScope;

          // extend the outer scope onto our new cell scope
          if($scope.cell.column.template || $scope.cell.column.cellRenderer){
            cellScope = $rootScope.$new(true);
            angular.forEach($scope.options.$outer, function(v,k) {
              if(k[0] !== '$'){
                cellScope[k] = v;
              }
            });

            cellScope.getValue = ctrl.getValue;
          }

          $scope.$watch('cell.value', () => {
            content.empty();

            if(cellScope){
              cellScope.value = $scope.cell.value;
              cellScope.row = $scope.cell.row;
            }

            if($scope.cell.column.template){
              var elm = angular.element(`<span>${$scope.cell.column.template.trim()}</span>`);
              content.append($compile(elm)(cellScope));
            } else if($scope.cell.column.cellRenderer){
              var elm = angular.element($scope.cell.column.cellRenderer(cellScope, content));
              content.append($compile(elm)(cellScope));
            } else {
              content[0].innerHTML = ctrl.getValue($scope.cell);
            }
          });
        }
      }
    }
  };
};
