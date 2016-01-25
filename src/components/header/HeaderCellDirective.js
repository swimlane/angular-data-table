import angular from 'angular';
import { HeaderCellController } from './HeaderCellController';

export function HeaderCellDirective($compile){
  return {
    restrict: 'E',
    controller: HeaderCellController,
    controllerAs: 'hcell',
    scope: true,
    bindToController: {
      options: '=',
      column: '=',
      onCheckboxChange: '&',
      onSort: '&',
      sortType: '=',
      onResize: '&',
      selected: '='
    },
    replace: true,
    template:
      `<div ng-class="hcell.cellClass()"
            class="dt-header-cell"
            draggable="true"
            data-id="{{column.$id}}"
            ng-style="hcell.styles()"
            title="{{::hcell.column.name}}">
        <div resizable="hcell.column.resizable"
             on-resize="hcell.onResized(width, hcell.column)"
             min-width="hcell.column.minWidth"
             max-width="hcell.column.maxWidth">
          <label ng-if="hcell.column.isCheckboxColumn && hcell.column.headerCheckbox" class="dt-checkbox">
            <input type="checkbox"
                   ng-checked="hcell.selected"
                   ng-click="hcell.onCheckboxChange()" />
          </label>
          <span class="dt-header-cell-label"
                ng-click="hcell.onSorted()">
          </span>
          <span ng-class="hcell.sortClass()"></span>
        </div>
      </div>`,
    compile: function() {
      return {
        pre: function($scope, $elm, $attrs, ctrl) {
          let label = $elm[0].querySelector('.dt-header-cell-label'), cellScope;

          if(ctrl.column.headerTemplate || ctrl.column.headerRenderer){
            cellScope = ctrl.options.$outer.$new(false);

            // copy some props
            cellScope.$header = ctrl.column.name;
            cellScope.$index = $scope.$index;
          }

          if(ctrl.column.headerTemplate){
            let elm = angular.element(`<span>${ctrl.column.headerTemplate.trim()}</span>`);
            angular.element(label).append($compile(elm)(cellScope));
          } else if(ctrl.column.headerRenderer){
            let elm = angular.element(ctrl.column.headerRenderer($elm));
            angular.element(label).append($compile(elm)(cellScope)[0]);
          } else {
            let val = ctrl.column.name;
            if(val === undefined || val === null) val = '';
            label.textContent = val;
          }
        }
      }
    }
  };
};
