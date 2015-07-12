import angular from 'angular';
import { ScrollbarWidth } from './utils/utils';

export function DataTableDirective($window, $timeout, throttle){
  return {
    restrict: 'E',
    replace: true,
    controller: 'DataTable',
    scope: {
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
      element.columns = element[0].getElementsByTagName('column');
      return `<div class="dt" ng-class="dt.tableCss(this)">
          <dt-header options="options"
                     on-checkbox-change="dt.onHeaderCheckboxChange(this)"
                     columns="dt.columnsByPin"
                     column-widths="dt.columnWidths"
                     ng-if="options.headerHeight"
                     on-resize="dt.onResize(this, column, width)"
                     selected="dt.isAllRowsSelected(this)"
                     on-sort="dt.onSort(this)">
          </dt-header>
          <dt-body rows="rows"
                   selected="selected"
                   expanded="expanded"
                   columns="dt.columnsByPin"
                   on-select="dt.onSelect(this, rows)"
                   on-row-click="dt.onRowClick(this, row)"
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
        </div>`
    },
    compile: function(tElem, tAttrs){
      return {
        pre: function($scope, $elm, $attrs, ctrl){
          ctrl.buildColumns($scope, $elm.columns);
          ctrl.transposeColumnDefaults($scope.options.columns);

          $scope.options.internal.scrollBarWidth = ScrollbarWidth();

          function resize() {
            var rect = $elm[0].getBoundingClientRect();

            $scope.options.internal.innerWidth = Math.floor(rect.width);

            if ($scope.options.scrollbarV) {
              var height = rect.height;

              if ($scope.options.headerHeight) {
                height = height - $scope.options.headerHeight;
              }

              if ($scope.options.footerHeight) {
                height = height - $scope.options.footerHeight;
              }

              $scope.options.internal.bodyHeight = height;
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
