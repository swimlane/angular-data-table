export class HeaderCellController{

  /**
   * Calculates the styles for the header cell directive
   * @return {styles}
   */
  styles(){
    return {
      width: this.column.width  + 'px',
      minWidth: this.column.minWidth  + 'px',
      maxWidth: this.column.maxWidth  + 'px',
      height: this.column.height  + 'px'
    };
  }

  /**
   * Calculates the css classes for the header cell directive
   */
  cellClass(){
    var cls = {
      'sortable': this.column.sortable,
      'dt-header-cell': true,
      'resizable': this.column.resizable
    };

    if(this.column.heaerClassName){
      cls[this.column.headerClassName] = true;
    }

    return cls;
  }

  /**
   * Toggles the sorting on the column
   */
  sort(scope){
    if(this.column.sortable){
      if(!this.column.sort){
        this.column.sort = 'asc';
      } else if(this.column.sort === 'asc'){
        this.column.sort = 'desc';
      } else if(this.column.sort === 'desc'){
        this.column.sort = undefined;
      }

      this.onSort({
        column: this.column
      });
    }
  }

  /**
   * Toggles the css class for the sort button
   */
  sortClass(){
    return {
      'sort-btn': true,
      'sort-asc icon-down': this.column.sort === 'asc',
      'sort-desc icon-up': this.column.sort === 'desc'
    };
  }

  /**
   * Updates the column width on resize
   * @param  {width}
   * @param  {column}
   */
  onResize(width, column){
    this.onResize({
      column: column,
      width: width
    });
    //column.width = width;
  }

  /**
   * Invoked when the header cell directive checkbox was changed
   * @param  {object} scope angularjs scope
   */
  onCheckboxChange(){
    this.onCheckboxChange();
  }

}
