import { TranslateXY } from '../../utils/translate';

export class HeaderController {

  /**
   * Returns the styles for the header directive.
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
   * @return {object} styles
   */
  innerStyles(){
    return {
      width: this.columnWidths.total + 'px'
    };
  }

  /**
   * Invoked when a column sort direction has changed
   * @param  {object} column
   */
  onSort(scope, column){
    this.onSort({
      column: column
    });
  }

  /**
   * Returns the styles by group for the headers.
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
   */
  onCheckboxChange(){
    this.onCheckboxChange();
  }

  /**
   * Occurs when a header cell directive triggered a resize

   * @param  {object} column
   * @param  {int} width
   */
  onResize(column, width){
    this.onResize({
      column: column,
      width: width
    });
  }

};
