import angular from 'angular';
import { ScrollbarWidth, ObjectId } from '../utils/utils';

export function DataTableDirective($window, $timeout, throttle, DataTableService){
  return {
    restrict: 'E',
    replace: true,
    controller: 'DataTableController',
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
      onRowClick: '&'
    },
    controllerAs: 'dt',
    template: function(element){
      // Gets the column nodes to transposes to column objects
      // http://stackoverflow.com/questions/30845397/angular-expressive-directive-design/30847609#30847609
      var columns = element[0].getElementsByTagName('column'), id = ObjectId();
      DataTableService.buildAndSaveColumns(id, columns);

      return `<div class="dt" ng-class="dt.tableCss()" data-column-id="${id}">
          <dt-header options="dt.options"
                     on-checkbox-change="dt.onHeaderCheckboxChange()"
                     columns="dt.columnsByPin"
                     column-widths="dt.columnWidths"
                     ng-if="dt.options.headerHeight"
                     on-resize="dt.onResize(column, width)"
                     selected="dt.isAllRowsSelected()"
                     on-sort="dt.onSorted()">
          </dt-header>
          <dt-body rows="dt.rows"
                   selected="dt.selected"
                   expanded="dt.expanded"
                   columns="dt.columnsByPin"
                   on-select="dt.onSelected(rows)"
                   on-row-click="dt.onRowClicked(row)"
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
          // Check and see if we had expressive columns
          // and if so, lets use those
          var id = $elm.attr('data-column-id'),
              columns = DataTableService.columns[id];
          if(columns){
            ctrl.options.columns = columns;
          }

          ctrl.transposeColumnDefaults();
          ctrl.options.internal.scrollBarWidth = ScrollbarWidth();

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
            }

            ctrl.adjustColumns();
            ctrl.calculatePageSize();
          }

          resize();
          $timeout(resize);
          $elm.addClass('dt-loaded');
          angular.element($window).bind('resize', throttle(() => {
            $timeout(resize);
          }));

          $scope.$on('$destroy', () => {
            // prevent memory leaks
            angular.element($window).off('resize');
          });
        }
      }
    }
  };
};
