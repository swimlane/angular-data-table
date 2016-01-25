import { TranslateXY } from '../../utils/translate';

export class HeaderController {

  /**
   * Returns the styles for the header directive.
   * @param  {object} scope
   * @return {object} styles
   */
  styles() {
    return {
      width: this.options.internal.innerWidth + 'px',
      height: this.options.headerHeight + 'px'
    }
  }

  /**
   * Returns the inner styles for the header directive
   * @param  {object} scope
   * @return {object} styles
   */
  innerStyles(){
    return {
      width: this.columnWidths.total + 'px'
    };
  }

  /**
   * Invoked when a column sort direction has changed
   * @param  {object} scope
   * @param  {object} column
   */
  onSorted(sortedColumn){
    if (this.options.sortType === 'single') {
      // if sort type is single, then only one column can be sorted at once,
      // so we set the sort to undefined for the other columns
      function unsortColumn(column) {
        if (column !== sortedColumn) {
          column.sort = undefined;
        }
      }

      this.columns.left.forEach(unsortColumn);
      this.columns.center.forEach(unsortColumn);
      this.columns.right.forEach(unsortColumn);
    }

    this.onSort({
      column: sortedColumn
    });
  }

  /**
   * Returns the styles by group for the headers.
   * @param  {scope}
   * @param  {group}
   * @return {styles object}
   */
  stylesByGroup(group){
    var styles = {
      width: this.columnWidths[group] + 'px'
    };

    if(group === 'center'){
      TranslateXY(styles, this.options.internal.offsetX * -1, 0);
    } else if(group === 'right'){
      var offset = (this.columnWidths.total - this.options.internal.innerWidth) *-1;
      TranslateXY(styles, offset, 0);
    }

    return styles;
  }

  /**
   * Invoked when the header cell directive's checkbox has changed.
   * @param  {scope}
   */
  onCheckboxChanged(){
    this.onCheckboxChange();
  }

  /**
   * Occurs when a header cell directive triggered a resize
   * @param  {object} scope
   * @param  {object} column
   * @param  {int} width
   */
  onResized(column, width){
    this.onResize({
      column: column,
      width: width
    });
  }

};
