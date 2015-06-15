import angular from 'angular';

export class CellController {

  /**
   * Calculates the styles for the Cell Directive
   * @param  {column}
   * @return {styles object}
   */
  styles(col){
    return {
      width: col.width  + 'px'
    };
  }

  /**
   * Calculates the css classes for the cell directive
   * @param  {column}
   * @return {class object}
   */
  cellClass(col){
    var style = {
      'dt-tree-col': col.isTreeColumn
    };

    if(col.className){
      style[col.className] = true;
    }

    return style;
  }

  /**
   * Calculates the tree class styles.
   * @param  {scope}
   * @return {css classes object}
   */
  treeClass(scope){
    return {
      'dt-tree-toggle': true,
      'icon-right': !scope.expanded,
      'icon-down': scope.expanded
    }
  }

  /**
   * Invoked when the tree toggle button was clicked.
   * @param  {event}
   * @param  {scope}
   */
  onTreeToggle(evt, scope){
    evt.stopPropagation();
    scope.expanded = !scope.expanded;
    scope.onTreeToggle({ 
      cell: {
        value: scope.value,
        column: scope.column,
        expanded: scope.expanded
      }
    });
  }

  /**
   * Invoked when the checkbox was changed
   * @param  {object} scope 
   */
  onCheckboxChange(scope){
    scope.onCheckboxChange();
  }

  /**
   * Returns the value in its fomatted form
   * @param  {object} scope 
   * @return {string} value
   */
  getValue(scope){
    var val = scope.column.cellDataGetter ? 
      scope.column.cellDataGetter(scope.value) : scope.value;

    if(val === undefined || val === null) val = '';

    return val;
  }

};

export function CellDirective($rootScope, $compile, $log){
  return {
    restrict: 'E',
    controller: 'CellController',
    controllerAs: 'cell',
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
            ng-style="cell.styles(column)"
            ng-class="cell.cellClass(column)">
        <label ng-if="column.isCheckboxColumn" class="dt-checkbox">
          <input type="checkbox" 
                 ng-checked="selected"
                 ng-click="cell.onCheckboxChange(this)" />
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
          var content = angular.element($elm[0].querySelector('.dt-cell-content'));
          $scope.$outer = $scope.options.$outer;
          
          $scope.$watch('value', () => {
            content.empty();
            
            if($scope.column.template){
              var elm = angular.element(`<span>${$scope.column.template.trim()}</span>`);
              content.append($compile(elm)($scope));
            } else if($scope.column.cellRenderer){
              var elm = angular.element($scope.column.cellRenderer($scope, content));
              content.append($compile(elm)($scope));
            } else {
              content[0].innerHTML = ctrl.getValue($scope);
            }
          });
        }
      }
    }
  };
};
