import angular from 'angular';

export function CellDirective($rootScope, $compile, $log){
  return {
    restrict: 'E',
    controller: 'CellController',
    scope: true,
    controllerAs: 'cell',
    bindToController: {
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
            data-title="{{::cell.column.name}}" 
            ng-style="cell.styles()"
            ng-class="cell.cellClass()">
        <label ng-if="cell.column.isCheckboxColumn" class="dt-checkbox">
          <input type="checkbox" 
                 ng-checked="cell.selected"
                 ng-click="cell.onCheckboxChanged($event)" />
        </label>
        <span ng-if="cell.column.isTreeColumn && cell.hasChildren"
              ng-class="cell.treeClass()"
              ng-click="cell.onTreeToggled($event)"></span>
        <span class="dt-cell-content"></span>
      </div>`,
    replace: true,
    compile: function() {
      return {
        pre: function($scope, $elm, $attrs, ctrl) {
          var content = angular.element($elm[0].querySelector('.dt-cell-content')), 
              cellScope;

          // extend the outer scope onto our new cell scope
          if(ctrl.column.template || ctrl.column.cellRenderer){
            cellScope = $rootScope.$new(true);
            angular.forEach(ctrl.options.$outer, function(v,k) {
              if(k[0] !== '$'){
                cellScope[k] = v;
              }
            });

            cellScope.getValue = ctrl.getValue;
          }
          
          $scope.$watch('cell.value', () => {
            content.empty();

            if(cellScope){
              cellScope.$cell = ctrl.value;
              cellScope.$row = ctrl.row;
            }
            
            if(ctrl.column.template){
              var elm = angular.element(`<span>${ctrl.column.template.trim()}</span>`);
              content.append($compile(elm)(cellScope));
            } else if(ctrl.column.cellRenderer){
              var elm = angular.element(ctrl.column.cellRenderer(cellScope, content));
              content.append($compile(elm)(cellScope));
            } else {
              content[0].innerHTML = ctrl.getValue();
            }
          });
        }
      }
    }
  };
};
