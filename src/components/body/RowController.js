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
    if(!col.prop) return '';
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
