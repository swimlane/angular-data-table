export class HeaderCellController{

  /**
   * Calculates the styles for the header cell directive
   * @param  {scope}
   * @return {styles}
   */
  styles(scope){
    return {
      width: scope.hcell.column.width  + 'px',
      minWidth: scope.hcell.column.minWidth  + 'px',
      maxWidth: scope.hcell.column.maxWidth  + 'px',
      height: scope.hcell.column.height  + 'px'
    };
  }

  /**
   * Calculates the css classes for the header cell directive
   * @param  {scope}
   */
  cellClass(scope){
    var cls = {
      'sortable': scope.hcell.column.sortable,
      'dt-header-cell': true,
      'resizable': scope.hcell.column.resizable
    };

    if(scope.hcell.column.heaerClassName){
      cls[scope.hcell.column.headerClassName] = true;
    }

    return cls;
  }

  /**
   * Toggles the sorting on the column
   * @param  {scope}
   */
  sort(scope){
    if(scope.hcell.column.sortable){
      if(!scope.hcell.column.sort){
        scope.hcell.column.sort = 'asc';
      } else if(scope.hcell.column.sort === 'asc'){
        scope.hcell.column.sort = 'desc';
      } else if(scope.hcell.column.sort === 'desc'){
        scope.hcell.column.sort = undefined;
      }

      scope.hcell.onSort({
        column: scope.hcell.column
      });
    }
  }

  /**
   * Toggles the css class for the sort button
   * @param  {scope}
   */
  sortClass(scope){
    return {
      'sort-btn': true,
      'sort-asc icon-down': scope.hcell.column.sort === 'asc',
      'sort-desc icon-up': scope.hcell.column.sort === 'desc'
    };
  }

  /**
   * Updates the column width on resize
   * @param  {width}
   * @param  {column}
   */
  onResize(scope, width, column){
    scope.hcell.onResize({
      column: column,
      width: width
    });
    //column.width = width;
  }

  /**
   * Invoked when the header cell directive checkbox was changed
   * @param  {object} scope angularjs scope
   */
  onCheckboxChange(scope){
    scope.hcell.onCheckboxChange();
  }

}
