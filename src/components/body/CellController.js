export class CellController {

  /**
   * Calculates the styles for the Cell Directive
   * @return {styles object}
   */
  styles(){
    return {
      width: this.column.width  + 'px',
	  'min-width': this.column.width + 'px'
    };
  }

  /**
   * Calculates the css classes for the cell directive
   * @param  {column}
   * @return {class object}
   */
  cellClass(){
    var style = {
      'dt-tree-col': this.column.isTreeColumn
    };

    if(this.column.className){
      style[this.column.className] = true;
    }

    return style;
  }

  /**
   * Calculates the tree class styles.
   * @return {css classes object}
   */
  treeClass(){
    return {
      'dt-tree-toggle': true,
      'icon-right': !this.expanded,
      'icon-down': this.expanded
    }
  }

  /**
   * Invoked when the tree toggle button was clicked.
   * @param  {event}
   */
  onTreeToggled(evt){
    evt.stopPropagation();
    this.expanded = !this.expanded;
    this.onTreeToggle({
      cell: {
        value: this.value,
        column: this.column,
        expanded: this.expanded
      }
    });
  }

  /**
   * Invoked when the checkbox was changed
   * @param  {object} event
   */
  onCheckboxChanged(event){
    event.stopPropagation();
    this.onCheckboxChange({ $event: event });
  }

  /**
   * Returns the value in its fomatted form
   * @return {string} value
   */
  getValue(){
    var val = this.column.cellDataGetter ?
      this.column.cellDataGetter(this.value) : this.value;

    if(val === undefined || val === null) val = '';
    return val;
  }

};
