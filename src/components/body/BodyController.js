import angular from 'angular';

export class BodyController{

  /**
   * A tale body controller
   * @param  {$scope}
   * @param  {$timeout}
   * @return {BodyController}
   */
  /*@ngInject*/
  constructor($scope, $timeout){
    this.$scope = $scope;
    this.tempRows = [];

    this.treeColumn = this.options.columns.find((c) => {
      return c.isTreeColumn;
    });

    this.groupColumn = this.options.columns.find((c) => {
      return c.group;
    });

    $scope.$watchCollection('body.rows', this.rowsUpdated.bind(this));

    if(this.options.scrollbarV || (!this.options.scrollbarV && this.options.paging.externalPaging)){
      var sized = false;
      $scope.$watch('body.options.paging.size', (newVal, oldVal) => {
        if(!sized || newVal > oldVal){
          this.getRows();
          sized = true;
        }
      });

      $scope.$watch('body.options.paging.count', (count) => {
        this.count = count;
        this.updatePage();
      });

      $scope.$watch('body.options.paging.offset', (newVal) => {
        if(this.options.paging.size){
          this.onPage({
            offset: newVal,
            size: this.options.paging.size
          });
        }
      });
    }
  }

  rowsUpdated(newVal, oldVal){
    if(newVal) {
      if(!this.options.paging.externalPaging){
        this.options.paging.count = newVal.length;
      }

      this.count = this.options.paging.count;

      if(this.treeColumn || this.groupColumn){
        this.buildRowsByGroup();
      }

      if(this.options.scrollbarV){
        let refresh = newVal && oldVal && (newVal.length === oldVal.length
          || newVal.length < oldVal.length);

        this.getRows(refresh);
      } else {
        let rows = this.rows;

        if(this.treeColumn){
          rows = this.buildTree();
        } else if(this.groupColumn){
          rows = this.buildGroups();
        }

        if(this.options.paging.externalPaging){
          let idxs = this.getFirstLastIndexes(),
              idx = idxs.first;

          this.tempRows.splice(0, this.tempRows.length);
          while(idx < idxs.last){
            this.tempRows.push(rows[idx++])
          }
        } else {
          this.tempRows.splice(0, this.tempRows.length);
          this.tempRows.push(...rows);
        }
      }
    }
  }

  /**
   * Gets the first and last indexes based on the offset, row height, page size, and overall count.
   */
  getFirstLastIndexes(){
    var firstRowIndex, endIndex;

    if(this.options.scrollbarV){
      firstRowIndex = Math.max(Math.floor((
          this.options.internal.offsetY || 0) / this.options.rowHeight, 0), 0);
      endIndex = Math.min(firstRowIndex + this.options.paging.size, this.count);
    } else {
      if(this.options.paging.externalPaging){
        firstRowIndex = Math.max(this.options.paging.offset * this.options.paging.size, 0);
        endIndex = Math.min(firstRowIndex + this.options.paging.size, this.count);
      } else {
        endIndex = this.count;
      }
    }

    return {
      first: firstRowIndex,
      last: endIndex
    };
  }

  /**
   * Updates the page's offset given the scroll position.
   */
  updatePage(){
    let curPage = this.options.paging.offset,
        idxs = this.getFirstLastIndexes();

    if (this.options.internal.oldScrollPosition === undefined){
      this.options.internal.oldScrollPosition = 0;
    }

    let oldScrollPosition = this.options.internal.oldScrollPosition,
        newPage = idxs.first / this.options.paging.size;

    this.options.internal.oldScrollPosition = newPage;

    if (newPage < oldScrollPosition) {
      // scrolling up
      newPage = Math.floor(newPage);
    } else if (newPage > oldScrollPosition){
      // scrolling down
      newPage = Math.ceil(newPage);
    } else {
      // equal, just stay on the current page
      newPage = curPage;
    }

    if(!isNaN(newPage)){
      this.options.paging.offset = newPage;
    }
  }

  /**
   * Matches groups to their respective parents by index.
   *
   * Example:
   *
   *  {
   *    "Acme" : [
   *      { name: "Acme Holdings", parent: "Acme" }
   *    ],
   *    "Acme Holdings": [
   *      { name: "Acme Ltd", parent: "Acme Holdings" }
   *    ]
   *  }
   *
   */
  buildRowsByGroup(){
    this.index = {};
    this.rowsByGroup = {};

    var parentProp = this.treeColumn ?
      this.treeColumn.relationProp :
      this.groupColumn.prop;

    for(var i = 0, len = this.rows.length; i < len; i++) {
      var row = this.rows[i];
      // build groups
      var relVal = row[parentProp];
      if(relVal){
        if(this.rowsByGroup[relVal]){
          this.rowsByGroup[relVal].push(row);
        } else {
          this.rowsByGroup[relVal] = [ row ];
        }
      }

      // build indexes
      if(this.treeColumn){
        var prop = this.treeColumn.prop;
        this.index[row[prop]] = row;

        if (row[parentProp] === undefined){
          row.$$depth = 0;
        } else {
          var parent = this.index[row[parentProp]];
          row.$$depth = parent.$$depth + 1;
          if (parent.$$children){
            parent.$$children.push(row[prop]);
          } else {
            parent.$$children = [row[prop]];
          }
        }
      }
    }
  }

  /**
   * Rebuilds the groups based on what is expanded.
   * This function needs some optimization, todo for future release.
   * @return {Array} the temp array containing expanded rows
   */
  buildGroups(){
    var temp = [];

    angular.forEach(this.rowsByGroup, (v, k) => {
      temp.push({
        name: k,
        group: true
      });

      if(this.expanded[k]){
        temp.push(...v);
      }
    });

    return temp;
  }

  /**
   * Returns if the row is selected
   * @param  {row}
   * @return {Boolean}
   */
  isSelected(row){
    var selected = false;

    if(this.options.selectable){
      if(this.options.multiSelect){
        selected = this.selected.indexOf(row) > -1;
      } else {
        selected = this.selected === row;
      }
    }

    return selected;
  }

  /**
   * Creates a tree of the existing expanded values
   * @return {array} the built tree
   */
  buildTree(){
    var count = 0,
        temp = [];

    for(var i = 0, len = this.rows.length; i < len; i++) {
      var row = this.rows[i],
          relVal = row[this.treeColumn.relationProp],
          keyVal = row[this.treeColumn.prop],
          rows = this.rowsByGroup[keyVal],
          expanded = this.expanded[keyVal];

      if(!relVal){
        count++;
        temp.push(row);
      }

      if(rows && rows.length){
        if(expanded){
          temp.push(...rows);
          count = count + rows.length;
        }
      }
    }

    return temp;
  }

  /**
   * Creates the intermediate collection that is shown in the view.
   * @param  {boolean} refresh - bust the tree/group cache
   */
  getRows(refresh){
    // only proceed when we have pre-aggregated the values
    if((this.treeColumn || this.groupColumn) && !this.rowsByGroup){
      return false;
    }

    var temp;

    if(this.treeColumn) {
      temp = this.treeTemp || [];
      // cache the tree build
      if((refresh || !this.treeTemp)){
        this.treeTemp = temp = this.buildTree();
        this.count = temp.length;

        // have to force reset, optimize this later
        this.tempRows.splice(0, this.tempRows.length);
      }
    } else if(this.groupColumn) {
      temp = this.groupsTemp || [];
      // cache the group build
      if((refresh || !this.groupsTemp)){
        this.groupsTemp = temp = this.buildGroups();
        this.count = temp.length;
      }
    } else {
      temp = this.rows;
       if(refresh === true){
        this.tempRows.splice(0, this.tempRows.length);
      }
    }

    var idx = 0,
        indexes = this.getFirstLastIndexes(),
        rowIndex = indexes.first;

    // slice out the old rows so we don't have duplicates
    this.tempRows.splice(0, indexes.last - indexes.first);

    while (rowIndex < indexes.last && rowIndex < this.count) {
      var row = temp[rowIndex];
      if(row){
        row.$$index = rowIndex;
        this.tempRows[idx] = row;
      }
      idx++;
      rowIndex++;
    }

    this.options.internal.styleTranslator.update(this.tempRows);

    return this.tempRows;
  }

  /**
   * Returns the styles for the table body directive.
   * @return {object}
   */
  styles(){
    var styles = {
      width: this.options.internal.innerWidth + 'px'
    };

    if(!this.options.scrollbarV){
      styles.overflowY = 'hidden';
    } else if(this.options.scrollbarH === false){
      styles.overflowX = 'hidden';
    }

    if(this.options.scrollbarV){
      styles.height = this.options.internal.bodyHeight + 'px';
    }

    return styles;
  }

  /**
   * Returns the styles for the row diretive.
   * @param  {row}
   * @return {styles object}
   */
  rowStyles(row){
    let styles = {};

    if(this.options.rowHeight === 'auto'){
      styles.height = this.options.rowHeight + 'px';
    }

    return styles;
  }

  /**
   * Builds the styles for the row group directive
   * @param  {object} row
   * @return {object} styles
   */
  groupRowStyles(row){
    var styles = this.rowStyles(row);
    styles.width = this.columnWidths.total + 'px';
    return styles;
  }

  /**
   * Returns the css classes for the row directive.
   * @param  {row}
   * @return {css class object}
   */
  rowClasses(row){
    var styles = {
      'selected': this.isSelected(row),
      'dt-row-even': row && row.$$index%2 === 0,
      'dt-row-odd': row && row.$$index%2 !== 0
    };

    if(this.treeColumn){
      // if i am a child
      styles['dt-leaf'] = this.rowsByGroup[row[this.treeColumn.relationProp]];
      // if i have children
      styles['dt-has-leafs'] = this.rowsByGroup[row[this.treeColumn.prop]];
      // the depth
      styles['dt-depth-' + row.$$depth] = true;
    }

    return styles;
  }

  /**
   * Returns the row model for the index in the view.
   * @param  {index}
   * @return {row model}
   */
  getRowValue(idx){
    return this.tempRows[idx];
  }

  /**
   * Calculates if a row is expanded or collasped for tree grids.
   * @param  {row}
   * @return {boolean}
   */
  getRowExpanded(row){
    if(this.treeColumn) {
      return this.expanded[row[this.treeColumn.prop]];
    } else if(this.groupColumn){
      return this.expanded[row.name];
    }
  }

  /**
   * Calculates if the row has children
   * @param  {row}
   * @return {boolean}
   */
  getRowHasChildren(row){
    if(!this.treeColumn) return;
    var children = this.rowsByGroup[row[this.treeColumn.prop]];
    return children !== undefined || (children && !children.length);
  }

  /**
   * Tree toggle event from a cell
   * @param  {row model}
   * @param  {cell model}
   */
  onTreeToggled(row, cell){
    var val  = row[this.treeColumn.prop];
    this.expanded[val] = !this.expanded[val];

    if(this.options.scrollbarV){
      this.getRows(true);
    } else {
      var values = this.buildTree();
      this.tempRows.splice(0, this.tempRows.length);
      this.tempRows.push(...values);
    }

    this.onTreeToggle({
      row: row,
      cell: cell
    });
  }

  /**
   * Invoked when the row group directive was expanded
   * @param  {object} row
   */
  onGroupToggle(row){
    this.expanded[row.name] = !this.expanded[row.name];

    if(this.options.scrollbarV){
      this.getRows(true);
    } else {
      var values = this.buildGroups();
      this.tempRows.splice(0, this.tempRows.length);
      this.tempRows.push(...values);
    }
  }
}
