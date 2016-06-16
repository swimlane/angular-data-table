import angular from 'angular';
import { DataTableController } from './DataTableController';
import { ScrollbarWidth, ObjectId } from '../utils/utils';
import { throttle } from '../utils/throttle';
import { DataTableService } from './DataTableService';

export function DataTableDirective($window, $timeout, $parse){
  return {
    restrict: 'E',
    replace: true,
    controller: DataTableController,
    scope: true,
    bindToController: {
      options: '=',
      rows: '=',
      selected: '=?',
      expanded: '=?',
      onSelect: '&',
      onSort: '&',
      onTreeToggle: '&',
      onPage: '&',
      onRowClick: '&',
      onRowDblClick: '&',
      onColumnResize: '&'
    },
    controllerAs: 'dt',
    template: function(element){
      // Gets the column nodes to transposes to column objects
      // http://stackoverflow.com/questions/30845397/angular-expressive-directive-design/30847609#30847609
      var columns = element[0].getElementsByTagName('column'),
          id = ObjectId();
      DataTableService.saveColumns(id, columns);

      return `<div class="dt" ng-class="dt.tableCss()" data-column-id="${id}">
          <dt-header options="dt.options"
                     on-checkbox-change="dt.onHeaderCheckboxChange()"
                     columns="dt.columnsByPin"
                     column-widths="dt.columnWidths"
                     ng-if="dt.options.headerHeight"
                     on-resize="dt.onResized(column, width)"
                     selected="dt.isAllRowsSelected()"
                     on-sort="dt.onSorted()">
          </dt-header>
          <dt-body rows="dt.rows"
                   selected="dt.selected"
                   expanded="dt.expanded"
                   columns="dt.columnsByPin"
                   on-select="dt.onSelected(rows)"
                   on-row-click="dt.onRowClicked(row)"
                   on-row-dbl-click="dt.onRowDblClicked(row)"
                   column-widths="dt.columnWidths"
                   options="dt.options"
                   on-page="dt.onBodyPage(offset, size)"
                   on-tree-toggle="dt.onTreeToggled(row, cell)">
           </dt-body>
          <dt-footer ng-if="dt.options.footerHeight"
                     ng-style="{ height: dt.options.footerHeight + 'px' }"
                     on-page="dt.onFooterPage(offset, size)"
                     paging="dt.options.paging">
           </dt-footer>
        </div>`
    },
    compile: function(tElem, tAttrs){
      return {
        pre: function($scope, $elm, $attrs, ctrl){
          DataTableService.buildColumns($scope, $parse);

          // Check and see if we had expressive columns
          // and if so, lets use those
          var id = $elm.attr('data-column-id'),
              columns = DataTableService.columns[id];
          if (columns) {
            ctrl.options.columns = columns;
          }

          ctrl.transposeColumnDefaults();
          ctrl.options.internal.scrollBarWidth = ScrollbarWidth();

          /**
           * Invoked on init of control or when the window is resized;
           */
          function resize() {
            var rect = $elm[0].getBoundingClientRect();

            ctrl.options.internal.innerWidth = Math.floor(rect.width);

            if (ctrl.options.scrollbarV) {
              var height = rect.height;

              if (ctrl.options.headerHeight) {
                height = height - ctrl.options.headerHeight;
              }

              if (ctrl.options.footerHeight) {
                height = height - ctrl.options.footerHeight;
              }

              ctrl.options.internal.bodyHeight = height;
              ctrl.calculatePageSize();
            }

            ctrl.adjustColumns();
          };

          angular.element($window).bind('resize',
            throttle(() => {
              $timeout(resize);
            }));

          // When an item is hidden for example
          // in a tab with display none, the height
          // is not calculated correrctly.  We need to watch
          // the visible attribute and resize if this occurs
          var checkVisibility = function() {
          var bounds = $elm[0].getBoundingClientRect(),
              visible = bounds.width && bounds.height;
            if (visible) resize();
            else $timeout(checkVisibility, 100);
          };
          checkVisibility();

          // add a loaded class to avoid flickering
          $elm.addClass('dt-loaded');

          // prevent memory leaks
          $scope.$on('$destroy', () => {
            angular.element($window).off('resize');
          });
        }
      };
    }
  };
};
