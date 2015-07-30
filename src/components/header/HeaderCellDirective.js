import angular from 'angular';

export function HeaderCellDirective($compile){
  return {
    restrict: 'E',
    controller: 'HeaderCellController',
    controllerAs: 'hcell',
    bindToController: true,
    scope: {
      column: '=',
      onCheckboxChange: '&',
      onSort: '&',
      onResize: '&',
      selected: '='
    },
    replace: true,
    template:
      `<div ng-class="hcell.cellClass()"
            draggable="true"
            ng-style="hcell.styles()"
            title="{{::hcell.column.name}}">
        <div resizable="hcell.column.resizable"
             on-resize="hcell.onResize(width, hcell.column)"
             min-width="hcell.column.minWidth"
             max-width="hcell.column.maxWidth">
          <label ng-if="hcell.column.isCheckboxColumn && hcell.column.headerCheckbox" class="dt-checkbox">
            <input type="checkbox"
                   ng-checked="selected"
                   ng-click="hcell.onCheckboxChange()" />
          </label>
          <span class="dt-header-cell-label"
                ng-click="hcell.sort(this)">
          </span>
          <span ng-class="hcell.sortClass()"></span>
        </div>
      </div>`,
    compile: function() {
      return {
        pre: function($scope, $elm, $attrs, ctrl) {
          var label = $elm[0].querySelector('.dt-header-cell-label');

          if($scope.hcell.column.headerRenderer){
            var elm = angular.element($scope.hcell.column.headerRenderer($scope, $elm));
            angular.element(label).append($compile(elm)($scope)[0]);
          } else {
            var val = $scope.hcell.column.name;
            if(val === undefined || val === null) val = '';
            label.innerHTML = val;
          }
        }
      }
    }
  };
};
