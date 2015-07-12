import { TranslateXY } from '../../utils/translate';

export class HeaderController {

  /**
   * Returns the styles for the header directive.
   * @param  {object} scope
   * @return {object} styles
   */
  styles(scope) {
    return {
      width: scope.options.internal.innerWidth + 'px',
      height: scope.options.headerHeight + 'px'
    }
  }

  /**
   * Returns the inner styles for the header directive
   * @param  {object} scope
   * @return {object} styles
   */
  innerStyles(scope){
    return {
      width: scope.columnWidths.total + 'px'
    };
  }

  /**
   * Invoked when a column sort direction has changed
   * @param  {object} scope
   * @param  {object} column
   */
  onSort(scope, column){
    scope.onSort({
      column: column
    });
  }

  /**
   * Returns the styles by group for the headers.
   * @param  {scope}
   * @param  {group}
   * @return {styles object}
   */
  stylesByGroup(scope, group){
    var styles = {
      width: scope.columnWidths[group] + 'px'
    };

    if(group === 'center'){
      TranslateXY(styles, scope.options.internal.offsetX * -1, 0);
    } else if(group === 'right'){
      var offset = (scope.columnWidths.total - scope.options.internal.innerWidth) *-1;
      TranslateXY(styles, offset, 0);
    }

    return styles;
  }

  /**
   * Invoked when the header cell directive's checkbox has changed.
   * @param  {scope}
   */
  onCheckboxChange(scope){
    scope.onCheckboxChange();
  }

  /**
   * Occurs when a header cell directive triggered a resize
   * @param  {object} scope  
   * @param  {object} column 
   * @param  {int} width  
   */
  onResize(scope, column, width){
    scope.onResize({
      column: column,
      width: width
    });
  }

};
