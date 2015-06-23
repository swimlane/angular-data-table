import angular from 'angular';
import { DeepValueGetter } from '../../utils/utils';
import { TranslateXY } from '../../utils/translate';

export class RowController {

  /**
   * Returns the value for a given column
   * @param  {scope}
   * @param  {col}
   * @return {value}
   */
  getValue(scope, col){
    return DeepValueGetter(scope.row, col.prop);
  }

  /**
   * Invoked when a cell triggers the tree toggle
   * @param  {scope}
   * @param  {cell}
   */
  onTreeToggle(scope, cell){
    scope.onTreeToggle({
      cell: cell,
      row: scope.row
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
      TranslateXY(styles, scope.options.internal.offsetX, 0);
    } else if(group === 'right'){
      var offset = ((scope.columnWidths.total - scope.options.internal.innerWidth) -
        scope.options.internal.offsetX) * -1;
      TranslateXY(styles, offset, 0);
    }

    return styles;
  }

  /**
   * Invoked when the cell directive's checkbox changed state
   * @param  {scope}
   */
  onCheckboxChange(scope){
    scope.onCheckboxChange({
      row: scope.row
    });
  }

}

export function RowDirective(){
  return {
    restrict: 'E',
    controller: 'RowController',
    controllerAs: 'rowCtrl',
    scope: {
      row: '=',
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
        <div class="dt-row-left dt-row-block" 
             ng-if="columns['left'].length"
             ng-style="rowCtrl.stylesByGroup(this, 'left')">
          <dt-cell ng-repeat="column in columns['left'] track by column.$id"
                   on-tree-toggle="rowCtrl.onTreeToggle(this, cell)"
                   column="column"
                   options="options"
                   has-children="hasChildren"
                   on-checkbox-change="rowCtrl.onCheckboxChange(this)"
                   selected="selected"
                   expanded="expanded"
                   row="row"
                   value="rowCtrl.getValue(this, column)">
          </dt-cell>
        </div>
        <div class="dt-row-center dt-row-block" 
             ng-style="rowCtrl.stylesByGroup(this, 'center')">
          <dt-cell ng-repeat="column in columns['center'] track by column.$id"
                   on-tree-toggle="rowCtrl.onTreeToggle(this, cell)"
                   column="column"
                   options="options"
                   has-children="hasChildren"
                   expanded="expanded"
                   selected="selected"
                   row="row"
                   on-checkbox-change="rowCtrl.onCheckboxChange(this)"
                   value="rowCtrl.getValue(this, column)">
          </dt-cell>
        </div>
        <div class="dt-row-right dt-row-block" 
             ng-if="columns['right'].length"
             ng-style="rowCtrl.stylesByGroup(this, 'right')">
          <dt-cell ng-repeat="column in columns['right'] track by column.$id"
                   on-tree-toggle="rowCtrl.onTreeToggle(this, cell)"
                   column="column"
                   options="options"
                   has-children="hasChildren"
                   selected="selected"
                   on-checkbox-change="rowCtrl.onCheckboxChange(this)"
                   row="row"
                   expanded="expanded"
                   value="rowCtrl.getValue(this, column)">
          </dt-cell>
        </div>
      </div>`,
    replace:true
  };
};
