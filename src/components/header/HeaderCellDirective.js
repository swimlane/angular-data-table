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
      `<div ng-class="hcell.cellClass(this)"
            draggable="true"
            ng-style="hcell.styles(this)"
            title="{{::column.name}}">
        <div resizable="column.resizable"
             on-resize="hcell.onResize(this, width, column)"
             min-width="column.minWidth"
             max-width="column.maxWidth">
          <label ng-if="column.isCheckboxColumn && column.headerCheckbox" class="dt-checkbox">
            <input type="checkbox"
                   ng-checked="selected"
                   ng-click="hcell.onCheckboxChange(this)" />
          </label>
          <span class="dt-header-cell-label"
                ng-click="hcell.sort(this)">
          </span>
          <span ng-class="hcell.sortClass(this)"></span>
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
