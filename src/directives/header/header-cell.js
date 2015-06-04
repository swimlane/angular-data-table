import angular from 'angular';
import { Resizable } from 'utils/resizable';
 
export class HeaderCellController{

  /**
   * Calculates the styles for the header cell directive
   * @param  {scope}
   * @return {styles}
   */
  styles(scope){
    return {
      width: scope.column.width  + 'px',
      minWidth: scope.column.minWidth  + 'px',
      maxWidth: scope.column.maxWidth  + 'px',
      height: scope.column.height  + 'px'
    };
  }

  /**
   * Calculates the css classes for the header cell directive
   * @param  {scope}
   */
  cellClass(scope){
    var cls = {
      'sortable': scope.column.sortable,
      'dt-header-cell': true,
      'resizable': scope.column.resizable
    };

    if(scope.column.heaerClassName){
      cls[scope.column.heaerClassName] = true;
    }

    return cls;
  }

  /**
   * Toggles the sorting on the column
   * @param  {scope}
   */
  sort(scope){
    if(scope.column.sortable){
      if(!scope.column.sort){
        scope.column.sort = 'asc';
      } else if(scope.column.sort === 'asc'){
        scope.column.sort = 'desc';
      } else if(scope.column.sort === 'desc'){
        scope.column.sort = undefined;
      }

      scope.onSort({
        column: scope.column
      });
    }
  }

  /**
   * Toggles the css class for the sort button
   * @param  {scope}
   */
  sortClass(scope){
    return {
      'sort-btn': true,
      'sort-asc icon-down': scope.column.sort === 'asc',
      'sort-desc icon-up': scope.column.sort === 'desc'
    };
  }

  /**
   * Updates the column width on resize
   * @param  {width}
   * @param  {column}
   */
  resized(width, column){
    column.width = width;
  }

  /**
   * Invoked when the header cell directive checkbox was changed
   * @param  {object} scope angularjs scope
   */
  onCheckboxChange(scope){
    scope.onCheckboxChange();
  }

}

export function HeaderCellDirective($compile){
  return {
    restrict: 'E',
    controller: 'HeaderCellController',
    controllerAs: 'hcell',
    scope: {
      column: '=',
      onCheckboxChange: '&',
      onSort: '&',
      selected: '='
    },
    replace: true,
    template: 
      `<div ng-class="hcell.cellClass(this)"
            ng-style="hcell.styles(this)"
            title="{{::column.name}}">
        <div resizable="column.resizable" 
             on-resize="hcell.resized(width, column)">
          <label ng-if="column.isCheckboxColumn" class="dt-checkbox">
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

          if($scope.column.headerRenderer){
            var elm = angular.element($scope.column.headerRenderer($scope, $elm));
            angular.element(label).append($compile(elm)($scope)[0]);
          } else {
            var val = $scope.column.name;
            if(val === undefined || val === null) val = '';
            label.innerHTML = val;
          }
        }
      }
    }
  };
};
