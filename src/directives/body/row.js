import angular from 'angular';
import { DeepValueGetter } from 'utils/utils';

export class RowController {

  /**
   * Returns the value for a given column
   * @param  {scope}
   * @param  {col}
   * @return {value}
   */
  getValue(scope, col){
    return DeepValueGetter(scope.value, col.prop);
  }

  /**
   * Invoked when a cell triggers the tree toggle
   * @param  {scope}
   * @param  {cell}
   */
  onTreeToggle(scope, cell){
    scope.onTreeToggle({
      cell: cell,
      row: scope.value
    });
  }

  /**
   * Calculates the styles for a pin group
   * @param  {scope}
   * @param  {group}
   * @return {styles object}
   */
  stylesByGroup(scope, group){
    var styles = {
      width: scope.columnWidths[group] + 'px'
    };

    if(group === 'left'){
      styles.transform = `translate3d(${scope.options.internal.offsetX}px, 0, 0)`;
    } else if(group === 'right'){
      var offset = (scope.columnWidths.total - scope.options.internal.innerWidth) -
        scope.options.internal.offsetX;
      styles.transform = `translate3d(-${offset}px, 0, 0)`;
    }

    return styles;
  }

  /**
   * Invoked when the cell directive's checkbox changed state
   * @param  {scope}
   */
  onCheckboxChange(scope){
    scope.onCheckboxChange({
      row: scope.value
    });
  }

}

export function RowDirective(){
  return {
    restrict: 'E',
    controller: 'RowController',
    controllerAs: 'row',
    scope: {
      value: '=',
      columns: '=',
      columnWidths: '=',
      expanded: '=',
      selected: '=',
      hasChildren: '=',
      options: '=',
      onCheckboxChange: '&',
      onTreeToggle: '&'
    },
    template: `
      <div class="dt-row">
        <div class="dt-row-left dt-row-block" ng-style="row.stylesByGroup(this, 'left')">
          <dt-cell ng-repeat="column in columns['left'] track by $index"
                   on-tree-toggle="row.onTreeToggle(this, cell)"
                   column="column"
                   has-children="hasChildren"
                   on-checkbox-change="row.onCheckboxChange(this)"
                   selected="selected"
                   expanded="expanded"
                   value="row.getValue(this, column)">
          </dt-cell>
        </div>
        <div class="dt-row-center dt-row-block" ng-style="row.stylesByGroup(this, 'center')">
          <dt-cell ng-repeat="column in columns['center'] track by $index"
                   on-tree-toggle="row.onTreeToggle(this, cell)"
                   column="column"
                   has-children="hasChildren"
                   expanded="expanded"
                   selected="selected"
                   on-checkbox-change="row.onCheckboxChange(this)"
                   value="row.getValue(this, column)">
          </dt-cell>
        </div>
        <div class="dt-row-right dt-row-block" ng-style="row.stylesByGroup(this, 'right')">
          <dt-cell ng-repeat="column in columns['right'] track by $index"
                   on-tree-toggle="row.onTreeToggle(this, cell)"
                   column="column"
                   has-children="hasChildren"
                   selected="selected"
                   on-checkbox-change="row.onCheckboxChange(this)"
                   expanded="expanded"
                   value="row.getValue(this, column)">
          </dt-cell>
        </div>
      </div>`,
    replace:true
  };
};
