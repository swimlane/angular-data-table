import { TranslateXY } from '../../utils/translate';

export class HeaderController {

  /**
   * Returns the styles for the header directive.
   * @param  {object} scope
   * @return {object} styles
   */
  styles(scope) {
    return {
      width: scope.header.options.internal.innerWidth + 'px',
      height: scope.header.options.headerHeight + 'px'
    }
  }

  /**
   * Returns the inner styles for the header directive
   * @param  {object} scope
   * @return {object} styles
   */
  innerStyles(scope){
    return {
      width: scope.header.columnWidths.total + 'px'
    };
  }

  /**
   * Invoked when a column sort direction has changed
   * @param  {object} scope
   * @param  {object} column
   */
  onSort(scope, column){
    console.log('column',column);
    scope.header.onSort({
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
      width: scope.header.columnWidths[group] + 'px'
    };

    if(group === 'center'){
      TranslateXY(styles, scope.header.options.internal.offsetX * -1, 0);
    } else if(group === 'right'){
      var offset = (scope.header.columnWidths.total - scope.header.options.internal.innerWidth) *-1;
      TranslateXY(styles, offset, 0);
    }

    return styles;
  }

  /**
   * Invoked when the header cell directive's checkbox has changed.
   * @param  {scope}
   */
  onCheckboxChange(scope){
    scope.header.onCheckboxChange();
  }

  /**
   * Occurs when a header cell directive triggered a resize
   * @param  {object} scope
   * @param  {object} column
   * @param  {int} width
   */
  onResize(scope, column, width){
    scope.header.onResize({
      column: column,
      width: width
    });
  }

};
