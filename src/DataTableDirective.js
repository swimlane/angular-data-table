import angular from 'angular';
import { ScrollbarWidth } from './utils/utils';

export function DataTableDirective($window, $timeout, throttle){
  return {
    restrict: 'E',
    replace: true,
    controller: 'DataTable',
    controllerAs: 'dt',
    bindToController: true,
    scope: {
      options: '=',
      rows: '=',
      selected: '=?',
      expanded: '=?',
      onSelect: '&',
      onSort: '&?',
      onTreeToggle: '&',
      onPage: '&',
      onRowClick: '&'
    },
    template: function(element){
      // Gets the column nodes to transposes to column objects
      // http://stackoverflow.com/questions/30845397/angular-expressive-directive-design/30847609#30847609
      element.columns = element[0].getElementsByTagName('column');
      return `<div class="dt" ng-class="dt.tableCss(this)">
          <dt-header options="dt.options"
                     on-checkbox-change="dt.onHeaderCheckboxChange(this)"
                     columns="dt.columnsByPin"
                     column-widths="dt.columnWidths"
                     ng-if="dt.options.headerHeight"
                     on-resize="dt.onResize(this, column, width)"
                     selected="dt.isAllRowsSelected(this)"
                     on-sort="dt.onSort(this)">
          </dt-header>
          <dt-body rows="dt.rows"
                   selected="dt.selected"
                   expanded="dt.expanded"
                   columns="dt.columnsByPin"
                   on-select="dt.onSelect(this, dt.rows)"
                   on-row-click="dt.onRowClick(this, row)"
                   column-widths="dt.columnWidths"
                   options="dt.options"
                   on-page="dt.onBodyPage(this, offset, size)"
                   on-tree-toggle="dt.onTreeToggle(this, row, cell)">
           </dt-body>
          <dt-footer ng-if="dt.options.footerHeight"
                     ng-style="{ height: dt.options.footerHeight + 'px' }"
                     on-page="dt.onFooterPage(this, offset, size)"
                     paging="dt.options.paging">
           </dt-footer>
        </div>`
    },
    compile: function(tElem, tAttrs){
      return {
        pre: function($scope, $elm, $attrs, ctrl){
          ctrl.buildColumns($scope, $elm.columns);
          ctrl.transposeColumnDefaults(ctrl.options.columns);

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

          $timeout(resize);
          $elm.addClass('dt-loaded');
          angular.element($window).bind('resize', throttle(() => {
            $timeout(resize);
          }));
        }
      }
    }
  };
};
