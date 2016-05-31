import angular from 'angular';
import { TableDefaults, ColumnDefaults } from '../defaults';
import { AdjustColumnWidths, ForceFillColumnWidths } from '../utils/math';
import { ColumnsByPin, ColumnGroupWidths, CamelCase, ObjectId, ScrollbarWidth } from '../utils/utils';
import { DataTableService } from './DataTableService';
import { throttle } from '../utils/throttle';

export class DataTableController {

  /**
   * Creates an instance of the DataTable Controller
   * @param  {scope}
   * @param  {filter}
   */
  /*@ngInject*/
  constructor($scope, $element, $parse, $window, $timeout, $filter, $log) {
    Object.assign(this, {
      $element,
      $timeout,
      $scope,
      $filter,
      $log,
      $scope,
      $parse,
      $window
    });
  }

  $onInit() {
    const children = this.$element.children();
    this.childElm = angular.element(children[0]);

    // set scope to the parent
    this.options.$outer = this.$scope.$parent;

    this.build();
    this.defaults();

    this.$scope.$watch('$ctrl.options.columns', (newVal, oldVal) => {
      this.transposeColumnDefaults();

      if(newVal.length !== oldVal.length){
        this.adjustColumns();
      }

      this.calculateColumns();
    }, true);

    // default sort
    var watch = this.$scope.$watch('$ctrl.rows', (newVal) => {
      if(newVal){
        watch();
        this.onSorted();
      }
    });

    this.options.internal.scrollBarWidth = ScrollbarWidth();
    this.setupSizing();

    // add a loaded class to avoid flickering
    this.childElm.addClass('dt-loaded');
  }

  $onDestroy() {
    angular.element(this.$window).off('resize');
  }

  build() {
    DataTableService.buildColumns(this.$scope, this.$parse);

    // Check and see if we had expressive columns
    // and if so, lets use those
    
    const id = this.childElm.attr('data-column-id');

    let columns = DataTableService.columns[id];
    if (columns) {
      this.options.columns = columns;
    }

    this.transposeColumnDefaults();
  }

  setupSizing() {
    /**
     * Invoked on init of control or when the window is resized;
     */
    const resize = () => {
      var rect = this.childElm[0].getBoundingClientRect();

      this.options.internal.innerWidth = Math.floor(rect.width);

      if (this.options.scrollbarV) {
        var height = rect.height;

        if (this.options.headerHeight) {
          height = height - this.options.headerHeight;
        }

        if (this.options.footerHeight) {
          height = height - this.options.footerHeight;
        }

        this.options.internal.bodyHeight = height;
        this.calculatePageSize();
      }

      this.adjustColumns();
    };

    angular.element(this.$window).bind('resize',
      throttle(() => {
        this.$timeout(resize);
      }));

    // When an item is hidden for example
    // in a tab with display none, the height
    // is not calculated correrctly.  We need to watch
    // the visible attribute and resize if this occurs
    var checkVisibility = () => {
    var bounds = this.$element[0].getBoundingClientRect(),
        visible = bounds.width && bounds.height;
      if (visible) resize();
      else this.$timeout(checkVisibility, 100);
    };

    checkVisibility();
  }

  /**
   * Creates and extends default options for the grid control
   */
  defaults(){
    this.expanded = this.expanded || {};

    this.options = angular.extend(angular.
      copy(TableDefaults), this.options);

    angular.forEach(TableDefaults.paging, (v,k) => {
      if(!this.options.paging[k]){
        this.options.paging[k] = v;
      }
    });

    if(this.options.selectable && this.options.multiSelect){
      this.selected = this.selected || [];
    }
  }

  /**
   * On init or when a column is added, we need to
   * make sure all the columns added have the correct
   * defaults applied.
   */
  transposeColumnDefaults(){
    for(var i=0, len = this.options.columns.length; i < len; i++) {
      var column = this.options.columns[i];
      column.$id = ObjectId();

      angular.forEach(ColumnDefaults, (v,k) => {
        if(!column.hasOwnProperty(k)){
          column[k] = v;
        }
      });

      if(column.name && !column.prop){
        column.prop = CamelCase(column.name);
      }

      this.options.columns[i] = column;
    }
  }

  /**
   * Calculate column groups and widths
   */
  calculateColumns(){
    var columns = this.options.columns;
    this.columnsByPin = ColumnsByPin(columns);
    this.columnWidths = ColumnGroupWidths(this.columnsByPin, columns);
  }

  /**
   * Returns the css classes for the data table.
   * @return {style object}
   */
  tableCss(){
    return {
      'fixed': this.options.scrollbarV,
      'selectable': this.options.selectable,
      'checkboxable': this.options.checkboxSelection
    };
  }

  /**
   * Adjusts the column widths to handle greed/etc.
   * @param  {int} forceIdx
   */
  adjustColumns(forceIdx){
    var width = this.options.internal.innerWidth - this.options.internal.scrollBarWidth;

    if(this.options.columnMode === 'force'){
      ForceFillColumnWidths(this.options.columns, width, forceIdx);
    } else if(this.options.columnMode === 'flex') {
      AdjustColumnWidths(this.options.columns, width);
    }
  }

  /**
   * Calculates the page size given the height * row height.
   * @return {[type]}
   */
  calculatePageSize(){
    this.options.paging.size = Math.ceil(
      this.options.internal.bodyHeight / this.options.rowHeight) + 1;
  }

  /**
   * Sorts the values of the grid for client side sorting.
   */
  onSorted(){
    if(!this.rows) return;

    // return all sorted column, in the same order in which they were sorted
    var sorts = this.options.columns
      .filter((c) => {
        return c.sort;
      })
      .sort((a, b) => {
        // sort the columns with lower sortPriority order first
        if (a.sortPriority && b.sortPriority){
          if (a.sortPriority > b.sortPriority) return 1;
          if (a.sortPriority < b.sortPriority) return -1;
        } else if (a.sortPriority){
          return -1;
        } else if (b.sortPriority){
          return 1;
        }

        return 0;
      })
      .map((c, i) => {
        // update sortPriority
        c.sortPriority = i + 1;
        return c;
      });

    if(sorts.length){
      this.onSort({sorts: sorts});

      if (this.options.onSort){
        this.options.onSort(sorts);
      }

      var clientSorts = [];
      for(var i=0, len=sorts.length; i < len; i++) {
        var c = sorts[i];
        if(c.comparator !== false){
          var dir = c.sort === 'asc' ? '' : '-';
          clientSorts.push(dir + c.prop);
        }
      }

      if(clientSorts.length){
        // todo: more ideal to just resort vs splice and repush
        // but wasn't responding to this change ...
        var sortedValues = this.$filter('orderBy')(this.rows, clientSorts);
        this.rows.splice(0, this.rows.length);
        this.rows.push(...sortedValues);
      }
    }

    this.options.internal.setYOffset &&
      this.options.internal.setYOffset(0);
  }

  /**
   * Invoked when a tree is collasped/expanded
   * @param  {row model}
   * @param  {cell model}
   */
  onTreeToggled(row, cell){
    this.onTreeToggle({
      row: row,
      cell: cell
    });
  }

  /**
   * Invoked when the body triggers a page change.
   * @param  {offset}
   * @param  {size}
   */
  onBodyPage(offset, size){
    this.onPage({
      offset: offset,
      size: size
    });
  }

  /**
   * Invoked when the footer triggers a page change.
   * @param  {offset}
   * @param  {size}
   */
  onFooterPage(offset, size){
    var pageBlockSize = this.options.rowHeight * size,
        offsetY = pageBlockSize * offset;

    this.options.internal.setYOffset(offsetY);
  }

  /**
   * Invoked when the header checkbox directive has changed.
   */
  onHeaderCheckboxChange(){
    if(this.rows){
      var matches = this.selected.length === this.rows.length;
      this.selected.splice(0, this.selected.length);

      if(!matches){
        this.selected.push(...this.rows);
      }
    }
  }

  /**
   * Returns if all the rows are selected
   * @return {Boolean} if all selected
   */
  isAllRowsSelected(){
    if(this.rows) return false;
    return this.selected.length === this.rows.length;
  }

  /**
   * Occurs when a header directive triggered a resize event
   * @param  {object} column
   * @param  {int} width
   */
  onResized(column, width){
    var idx =this.options.columns.indexOf(column);
    if(idx > -1){
      var column = this.options.columns[idx];
      column.width = width;
      column.canAutoResize = false;

      this.adjustColumns(idx);
      this.calculateColumns();
    }

    if (this.onColumnResize){
      this.onColumnResize({
        column: column,
        width: width
      });
    }
  }

  /**
   * Occurs when a row was selected
   * @param  {object} rows
   */
  onSelected(rows){
    this.onSelect({
      rows: rows
    });
  }

  /**
   * Occurs when a row was click but may not be selected.
   * @param  {object} row
   */
  onRowClicked(row){
    this.onRowClick({
      row: row
    });
  }

  /**
   * Occurs when a row was double click but may not be selected.
   * @param  {object} row
   */
  onRowDblClicked(row){
    this.onRowDblClick({
      row: row
    });
  }

}
