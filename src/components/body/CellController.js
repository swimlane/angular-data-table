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
   * @param  {object} event 
   * @param  {object} scope 
   */
  onCheckboxChange(event, scope){
    event.stopPropagation();
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
