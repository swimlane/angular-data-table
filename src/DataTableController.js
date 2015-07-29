import angular from 'angular';
import { scrollHelper } from './components/body/scrollHelper';
import { TableDefaults, ColumnDefaults } from './defaults';
import { AdjustColumnWidths, ForceFillColumnWidths } from './utils/math';
import { ColumnsByPin, ColumnGroupWidths, CamelCase, ObjectId, ScrollbarWidth } from './utils/utils';

export class DataTableController {

  /**
   * Creates an instance of the DataTable Controller
   * @param  {scope}
   * @param  {filter}
   */
  /*@ngInject*/
  constructor($scope, $filter, $log, $transclude){
    angular.extend(this, {
      $scope: $scope,
      $filter: $filter,
      $log: $log
    });

    this.$scope = $scope;

    this.defaults($scope);

    // set scope to the parent
    this.options.$outer = this.$parent;

    this.$scope.$watch('dt.options.columns', (newVal, oldVal) => {
      if(newVal.length > oldVal.length){
        this.transposeColumnDefaults(newVal);
      }

      if(newVal.length !== oldVal.length){
        this.adjustColumns();
      }

      this.calculateColumns();
    }, true);
  }

  /**
   * Create columns from elements
   * @param  {array} columnElms
   */
  buildColumns(scope, columnElms){
    if(columnElms && columnElms.length){
      var columns = [];

      angular.forEach(columnElms, (c) => {
        var column = {};

        angular.forEach(c.attributes, (attr) => {
          var attrName = CamelCase(attr.name);

          if(ColumnDefaults.hasOwnProperty(attrName)){
            var val = attr.value;

            if(!isNaN(attr.value)){
              val = parseInt(attr.value);
            }

            column[attrName] = val;
          }

          // cuz putting className vs class on
          // a element feels weird
          if(attrName === 'class'){
            column.className = attr.value;
          }

          if(attrName === 'name'){
            column.name = attr.value;
          }
        });

        if(c.innerHTML !== ''){
          column.template = c.innerHTML;
        }

        columns.push(column);
      });

      this.options.columns = columns;
    }
  }

  /**
   * Creates and extends default options for the grid control
   * @param  {scope}
   */
  defaults($scope){
    $scope.expanded = $scope.expanded || {};

    var options = angular.extend(angular.
      copy(TableDefaults), this.options);

    options.paging = angular.extend(angular.copy(TableDefaults.paging),
      this.options.paging);

    this.options = this.$scope.options = options;

    if(this.options.selectable && this.options.multiSelect){
      $scope.selected = $scope.selected || [];
    }

    // default sort
    var watch = this.$scope.$watch('dt.rows', (newVal) => {
      if(newVal){
        watch();
        console.log('this.onSort, $scope = ',$scope);
        this.onSort($scope);
      }
    });
  }

  /**
   * On init or when a column is added, we need to
   * make sure all the columns added have the correct
   * defaults applied.
   * @param  {Object} columns
   */
  transposeColumnDefaults(columns){
    for(var i=0, len = columns.length; i < len; i++) {
      var column = columns[i];
      column.$id = ObjectId();

      angular.forEach(ColumnDefaults, (v,k) => {
        if(!column.hasOwnProperty(k)){
          column[k] = v;
        }
      });

      if(column.name && !column.prop){
        column.prop = CamelCase(column.name);
      }

      columns[i] = column;
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
   * @param  {scope}
   * @return {style object}
   */
  tableCss(scope){
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
    var width = this.options.internal.innerWidth -
      this.options.internal.scrollBarWidth;

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
   * @param  {scope}
   */
  onSort(scope){
    console.log('onSort from DataTableController.js')
    if(!scope.dt.rows) return;

    var sorts = scope.options.columns.filter((c) => {
      return c.sort;
    });

    if(sorts.length){
      console.log(this);
      if(this.$scope.onSort){
        this.$scope.onSort({ sorts: sorts });
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
        var sortedValues = this.$filter('orderBy')(scope.dt.rows, clientSorts);
        scope.dt.rows.splice(0, scope.dt.rows.length);
        scope.dt.rows.push(...sortedValues);
      }
    }

    scrollHelper.setYOffset(0);
  }

  /**
   * Invoked when a tree is collasped/expanded
   * @param  {scope}
   * @param  {row model}
   * @param  {cell model}
   */
  onTreeToggle(scope, row, cell){
    scope.dt.onTreeToggle({
      row: row,
      cell: cell
    });
  }

  /**
   * Invoked when the body triggers a page change.
   * @param  {scope}
   * @param  {offset}
   * @param  {size}
   */
  onBodyPage(scope, offset, size){
    scope.dt.onPage({
      offset: offset,
      size: size
    });
  }

  /**
   * Invoked when the footer triggers a page change.
   * @param  {scope}
   * @param  {offset}
   * @param  {size}
   */
  onFooterPage(scope, offset, size){
    var pageBlockSize = scope.dt.options.rowHeight * size,
        offsetY = pageBlockSize * offset;

    scrollHelper.setYOffset(offsetY);
  }

  /**
   * Invoked when the header checkbox directive has changed.
   * @param  {scope}
   */
  onHeaderCheckboxChange(scope){
    if(scope.dt.rows){
      var matches = scope.selected.length === scope.dt.rows.length;
      scope.selected.splice(0, scope.selected.length);

      if(!matches){
        scope.selected.push(...scope.dt.rows);
      }
    }
  }

  /**
   * Returns if all the rows are selected
   * @param  {scope}  scope
   * @return {Boolean} if all selected
   */
  isAllRowsSelected(scope){
    if(!scope.dt.rows) return false;
    return scope.selected.length === scope.dt.rows.length;
  }

  /**
   * Occurs when a header directive triggered a resize event
   * @param  {object} scope
   * @param  {object} column
   * @param  {int} width
   */
  onResize(scope, column, width){
    var idx = scope.options.columns.indexOf(column);
    if(idx > -1){
      var column = scope.options.columns[idx];
      column.width = width;
      column.canAutoResize = false;

      this.adjustColumns(idx);
      this.calculateColumns();
    }
  }

  /**
   * Occurs when a row was selected
   * @param  {object} scope
   * @param  {object} rows
   */
  onSelect(scope, rows){
    scope.onSelect({
      rows: rows
    });
  }

  /**
   * Occurs when a row was click but may not be selected.
   * @param  {object} scope
   * @param  {object} row
   */
  onRowClick(scope, row){
    scope.onRowClick({
      row: row
    });
  }

}
