import angular from 'angular';

import './utils/polyfill';
import { debounce, throttle } from './utils/throttle';

import { Resizable } from './utils/resizable';
import { Sortable } from './utils/sortable';
import { AdjustColumnWidths, ForceFillColumnWidths } from './utils/math';
import { ColumnsByPin, ColumnGroupWidths } from 'utils/utils';

import { TableDefaults, ColumnDefaults } from './defaults';

import { HeaderController, HeaderDirective } from './components/header/header';
import { HeaderCellDirective, HeaderCellController } from './components/header/header-cell';

import { BodyController, BodyHelper, BodyDirective } from './components/body/body';
import { RowController, RowDirective } from './components/body/row';
import { GroupRowController, GroupRowDirective } from './components/body/group-row';
import { CellController, CellDirective } from './components/body/cell';

import { FooterController, FooterDirective } from './components/footer/footer';
import { PagerController, PagerDirective } from './components/footer/pager';

class DataTableController {

  /**
   * Creates an instance of the DataTable Controller
   * @param  {scope}
   * @param  {filter}
   */
  /*@ngInject*/
	constructor($scope, $filter, $log){
    angular.extend(this, {
      $scope: $scope,
      $filter: $filter,
      $log: $log
    });

    this.defaults($scope);
    $scope.$watch('options.columns', (newVal, oldVal) => {
      if(newVal.length > oldVal.length){
        this.transposeColumnDefaults(newVal);
      }
      this.calculateColumns(newVal);
    }, true);
	}

  /**
   * Creates and extends default options for the grid control
   * @param  {scope}
   */
  defaults($scope){
    $scope.expanded = $scope.expanded || {};

    var options = angular.extend(angular.
      copy(TableDefaults), $scope.options);

    options.paging = angular.extend(angular.copy(TableDefaults.paging),
      $scope.options.paging);

    this.transposeColumnDefaults(options.columns);

    $scope.options = options;

    if($scope.options.selectable && $scope.options.multiSelect){
      $scope.selected = $scope.selected || [];
    }

    // default sort
    var watch = $scope.$watch('values', (newVal) => {
      if(newVal){
        watch();
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
    for(var i=0, len=columns.length; i < len; i++) {
      var column = columns[i];
      column = angular.extend(angular.copy(ColumnDefaults), column);

      if(!column.name){
        this.$log.warn(`'Name' property expected but not defined.`, column);
        column.name = Math.random();
      }

      columns[i] = column;
    }
  }

  /**
   * Calculate column groups and widths
   * @param  {object} columns
   */
  calculateColumns(columns){
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
      'fixed': scope.options.scrollbarV,
      'selectable': scope.options.selectable,
      'checkboxable': scope.options.checkboxSelection
    };
  }

  /**
   * Adjusts the column widths to handle greed/etc.
   * @return {[type]}
   */
  adjustColumns(){
    // todo: combine these
    if(this.$scope.options.forceFillColumns){
      ForceFillColumnWidths(this.$scope.options.columns, 
        this.$scope.options.internal.innerWidth);
    } else {
      AdjustColumnWidths(this.$scope.options.columns, 
        this.$scope.options.internal.innerWidth);
    }
  }

  /**
   * Calculates the page size given the height * row height.
   * @return {[type]}
   */
  calculatePageSize(){
    this.$scope.options.paging.size = Math.ceil(
      this.$scope.options.internal.bodyHeight / this.$scope.options.rowHeight) + 1;
  }

  /**
   * Sorts the values of the grid for client side sorting.
   * @param  {scope}
   */
  onSort(scope){
    if(!scope.values) return;

    var sorts = scope.options.columns.filter((c) => {
      return c.sort;
    });

    if(sorts.length){
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
        var sortedValues = this.$filter('orderBy')(scope.values, clientSorts);
        scope.values.splice(0, scope.values.length);
        scope.values.push(...sortedValues);
      }
    }

    BodyHelper.setYOffset(0);
  }

  /**
   * Invoked when a tree is collasped/expanded
   * @param  {scope}
   * @param  {row model}
   * @param  {cell model}
   */
  onTreeToggle(scope, row, cell){
    scope.onTreeToggle({
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
    scope.onPage({
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
    var pageBlockSize = scope.options.rowHeight * size,
        offsetY = pageBlockSize * offset;

    BodyHelper.setYOffset(offsetY);
  }

  /**
   * Invoked when the header checkbox directive has changed.
   * @param  {scope}
   */
  onHeaderCheckboxChange(scope){
    if(scope.values){
      var matches = scope.selected.length === scope.values.length;
      scope.selected.splice(0, scope.selected.length);

      if(!matches){
        scope.selected.push(...scope.values);
      }
    }
  }

  /**
   * Returns if all the rows are selected
   * @param  {scope}  scope
   * @return {Boolean} if all selected
   */
  isAllRowsSelected(scope){
    if(!scope.values) return false;
    return scope.selected.length === scope.values.length;
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
      scope.options.columns[idx].width = width;
      this.calculateColumns(scope.options.columns);
    }
  }

}

function DataTableDirective($window, $timeout, throttle){
  return {
    restrict: 'E',
    replace: true,
    controller: 'DataTable',
    scope: {
      options: '=',
      values: '=',
      selected: '=?',
      expanded: '=?',
      onSelect: '&',
      onSort: '&',
      onTreeToggle: '&',
      onPage: '&'
    },
    controllerAs: 'dt',
    template:
      `<div class="dt material" ng-class="dt.tableCss(this)">
        <dt-header options="options"
                   on-checkbox-change="dt.onHeaderCheckboxChange(this)"
                   columns="dt.columnsByPin"
                   column-widths="dt.columnWidths"
                   ng-if="options.headerHeight"
                   on-resize="dt.onResize(this, column, width)"
                   selected="dt.isAllRowsSelected(this)"
                   on-sort="dt.onSort(this)">
        </dt-header>
        <dt-body values="values"
                 selected="selected"
                 expanded="expanded"
                 columns="dt.columnsByPin"
                 column-widths="dt.columnWidths"
                 options="options"
                 on-page="dt.onBodyPage(this, offset, size)"
                 on-tree-toggle="dt.onTreeToggle(this, row, cell)">
         </dt-body>
        <dt-footer ng-if="options.footerHeight"
                   ng-style="{ height: options.footerHeight + 'px' }"
                   on-page="dt.onFooterPage(this, offset, size)"
                   paging="options.paging">
         </dt-footer>
      </div>`,
    compile: function(tElem, tAttrs){
      return {
        pre: function($scope, $elm, $attrs, ctrl){

          function resize(){
            $scope.options.internal.innerWidth = $elm[0].offsetWidth;

            if($scope.options.scrollbarV){
              var height = $elm[0].offsetHeight;

              if($scope.options.headerHeight){
                height = height - $scope.options.headerHeight;
              }

              if($scope.options.footerHeight){
                height = height - $scope.options.footerHeight;
              }

              $scope.options.internal.bodyHeight = height;
            }

            ctrl.adjustColumns();
            ctrl.calculatePageSize();
          }

          resize();
          angular.element($window).bind('resize', throttle(() => {
            $timeout(resize);
          }));
        }
      }
    }
  };
};

export default angular
  .module('data-table', [])

  .controller('DataTable', DataTableController)
  .directive('dt', DataTableDirective)

  .directive('resizable', Resizable)
  .directive('sortable', Sortable)
  .constant('debounce', debounce)
  .constant('throttle', throttle)

  .controller('HeaderController', HeaderController)
  .directive('dtHeader', HeaderDirective)

  .controller('HeaderCellController', HeaderCellController)
  .directive('dtHeaderCell', HeaderCellDirective)

  .controller('BodyController', BodyController)
  .directive('dtBody', BodyDirective)

  .controller('RowController', RowController)
  .directive('dtRow', RowDirective)

  .controller('GroupRowController', GroupRowController)
  .directive('dtGroupRow', GroupRowDirective)

  .controller('CellController', CellController)
  .directive('dtCell', CellDirective)

  .controller('FooterController', FooterController)
  .directive('dtFooter', FooterDirective)

  .controller('PagerController', PagerController)
  .directive('pager', PagerDirective)

