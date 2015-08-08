import angular from 'angular';
import { ScrollbarWidth } from './utils/utils';

export function DataTableDirective($window, $timeout, throttle){
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
      // workaround for problem storing data on an element that's then
      // transcluded: https://github.com/Swimlane/angular-data-table/issues/43
      var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
          return v.toString(16);
      });

      var columns = element[0].getElementsByTagName('column');

      angular.element(document).find('body').data(uuid, columns);

      return `<div class="dt" ng-class="dt.tableCss()" dt-id="${ uuid }">
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
          $elm.columns = angular.element(document).find('body').data($attrs.dtId);
          ctrl.buildColumns($elm.columns);
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
          angular.element($window).on('resize', throttle(() => {
            $timeout(resize);
          }));

          $scope.$on('$destroy', () => {
            // prevent memory leaks
            angular.element($window).off('resize');
            // remove column data from DOM
            angular.element(document).find('body').removeData($attrs.dtId);
          })
        }
      }
    }
  };
};
