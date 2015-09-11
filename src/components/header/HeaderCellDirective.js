import angular from 'angular';
import { HeaderCellController } from './HeaderCellController';

export function HeaderCellDirective($compile){
  return {
    restrict: 'E',
    controller: HeaderCellController,
    controllerAs: 'hcell',
    scope: true,
    bindToController: {
      column: '=',
      onCheckboxChange: '&',
      onSort: '&',
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
          var label = $elm[0].querySelector('.dt-header-cell-label');

          if(ctrl.column.headerRenderer){
            var elm = angular.element(ctrl.column.headerRenderer($elm));
            angular.element(label).append($compile(elm)($scope)[0]);
          } else {
            var val = ctrl.column.name;
            if(val === undefined || val === null) val = '';
            label.innerHTML = val;
          }
        }
      }
    }
  };
};
