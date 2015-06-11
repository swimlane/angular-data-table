System.register(['angular', './utils/polyfill', './utils/throttle', './components/footer/pager', './utils/resizable', './utils/sortable', './utils/math', 'utils/utils', './defaults', './components/header/header', './components/header/header-cell', './components/body/body', './components/body/row', './components/body/group-row', './components/body/cell', './components/footer/footer'], function (_export) {
  'use strict';

  var angular, debounce, throttle, Pager, Resizable, Sortable, AdjustColumnWidths, ForceFillColumnWidths, ColumnsByPin, ColumnGroupWidths, TableDefaults, ColumnDefaults, HeaderController, HeaderDirective, HeaderCellDirective, HeaderCellController, BodyController, BodyHelper, BodyDirective, RowController, RowDirective, GroupRowController, GroupRowDirective, CellController, CellDirective, FooterController, FooterDirective, DataTableController;

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function DataTableDirective($window, $timeout, throttle) {
    return {
      restrict: 'E',
      replace: true,
      controller: 'DataTable',
      scope: {
        options: '=',
        values: '=',
        selected: '=',
        expanded: '=',
        onSelect: '&',
        onSort: '&',
        onTreeToggle: '&',
        onPage: '&'
      },
      controllerAs: 'dt',
      template: '<div class="dt material" ng-class="dt.tableCss(this)">\n        <dt-header options="options"\n                   on-checkbox-change="dt.onHeaderCheckboxChange(this)"\n                   columns="dt.columnsByPin"\n                   column-widths="dt.columnWidths"\n                   ng-if="options.headerHeight"\n                   on-resize="dt.onResize(this, column, width)"\n                   selected="dt.isAllRowsSelected(this)"\n                   on-sort="dt.onSort(this)">\n        </dt-header>\n        <dt-body values="values"\n                 selected="selected"\n                 expanded="expanded"\n                 columns="dt.columnsByPin"\n                 column-widths="dt.columnWidths"\n                 options="options"\n                 on-page="dt.onBodyPage(this, offset, size)"\n                 on-tree-toggle="dt.onTreeToggle(this, row, cell)">\n         </dt-body>\n        <dt-footer ng-if="options.footerHeight"\n                   ng-style="{ height: options.footerHeight + \'px\' }"\n                   on-page="dt.onFooterPage(this, offset, size)"\n                   paging="options.paging">\n         </dt-footer>\n      </div>',
      compile: function compile(tElem, tAttrs) {
        return {
          pre: function pre($scope, $elm, $attrs, ctrl) {

            function resize() {
              $scope.options.internal.innerWidth = $elm[0].offsetWidth;

              if ($scope.options.scrollbarV) {
                var height = $elm[0].offsetHeight;

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

            resize();
            angular.element($window).bind('resize', throttle(function () {
              $timeout(resize);
            }));
          }
        };
      }
    };
  }
  DataTableDirective.$inject = ["$window", "$timeout", "throttle"];return {
    setters: [function (_angular) {
      angular = _angular['default'];
    }, function (_utilsPolyfill) {}, function (_utilsThrottle) {
      debounce = _utilsThrottle.debounce;
      throttle = _utilsThrottle.throttle;
    }, function (_componentsFooterPager) {
      Pager = _componentsFooterPager['default'];
    }, function (_utilsResizable) {
      Resizable = _utilsResizable.Resizable;
    }, function (_utilsSortable) {
      Sortable = _utilsSortable.Sortable;
    }, function (_utilsMath) {
      AdjustColumnWidths = _utilsMath.AdjustColumnWidths;
      ForceFillColumnWidths = _utilsMath.ForceFillColumnWidths;
    }, function (_utilsUtils) {
      ColumnsByPin = _utilsUtils.ColumnsByPin;
      ColumnGroupWidths = _utilsUtils.ColumnGroupWidths;
    }, function (_defaults) {
      TableDefaults = _defaults.TableDefaults;
      ColumnDefaults = _defaults.ColumnDefaults;
    }, function (_componentsHeaderHeader) {
      HeaderController = _componentsHeaderHeader.HeaderController;
      HeaderDirective = _componentsHeaderHeader.HeaderDirective;
    }, function (_componentsHeaderHeaderCell) {
      HeaderCellDirective = _componentsHeaderHeaderCell.HeaderCellDirective;
      HeaderCellController = _componentsHeaderHeaderCell.HeaderCellController;
    }, function (_componentsBodyBody) {
      BodyController = _componentsBodyBody.BodyController;
      BodyHelper = _componentsBodyBody.BodyHelper;
      BodyDirective = _componentsBodyBody.BodyDirective;
    }, function (_componentsBodyRow) {
      RowController = _componentsBodyRow.RowController;
      RowDirective = _componentsBodyRow.RowDirective;
    }, function (_componentsBodyGroupRow) {
      GroupRowController = _componentsBodyGroupRow.GroupRowController;
      GroupRowDirective = _componentsBodyGroupRow.GroupRowDirective;
    }, function (_componentsBodyCell) {
      CellController = _componentsBodyCell.CellController;
      CellDirective = _componentsBodyCell.CellDirective;
    }, function (_componentsFooterFooter) {
      FooterController = _componentsFooterFooter.FooterController;
      FooterDirective = _componentsFooterFooter.FooterDirective;
    }],
    execute: function () {
      DataTableController = (function () {

        /**
         * Creates an instance of the DataTable Controller
         * @param  {scope}
         * @param  {filter}
         */
        /*@ngInject*/

        function DataTableController($scope, $filter, $log) {
          var _this = this;

          _classCallCheck(this, DataTableController);

          angular.extend(this, {
            $scope: $scope,
            $filter: $filter,
            $log: $log
          });

          this.defaults($scope);
          $scope.$watch('options.columns', function (newVal, oldVal) {
            if (newVal.length > oldVal.length) {
              _this.transposeColumnDefaults(newVal);
            }
            _this.calculateColumns(newVal);
          }, true);
        }
        DataTableController.$inject = ["$scope", "$filter", "$log"];

        _createClass(DataTableController, [{
          key: 'defaults',

          /**
           * Creates and extends default options for the grid control
           * @param  {scope}
           */
          value: function defaults($scope) {
            var _this2 = this;

            $scope.expanded = $scope.expanded || {};

            var options = angular.extend(angular.copy(TableDefaults), $scope.options);

            options.paging = angular.extend(angular.copy(TableDefaults.paging), $scope.options.paging);

            this.transposeColumnDefaults(options.columns);

            $scope.options = options;

            if ($scope.options.selectable && $scope.options.multiSelect) {
              $scope.selected = $scope.selected || [];
            }

            // default sort
            var watch = $scope.$watch('values', function (newVal) {
              if (newVal) {
                watch();
                _this2.onSort($scope);
              }
            });
          }
        }, {
          key: 'transposeColumnDefaults',

          /**
           * On init or when a column is added, we need to
           * make sure all the columns added have the correct
           * defaults applied.
           * @param  {Object} columns
           */
          value: function transposeColumnDefaults(columns) {
            for (var i = 0, len = columns.length; i < len; i++) {
              var column = columns[i];
              column = angular.extend(angular.copy(ColumnDefaults), column);

              if (!column.name) {
                this.$log.warn('\'Name\' property expected but not defined.', column);
                column.name = Math.random();
              }

              columns[i] = column;
            }
          }
        }, {
          key: 'calculateColumns',

          /**
           * Calculate column groups and widths
           * @param  {object} columns
           */
          value: function calculateColumns(columns) {
            this.columnsByPin = ColumnsByPin(columns);
            this.columnWidths = ColumnGroupWidths(this.columnsByPin, columns);
          }
        }, {
          key: 'tableCss',

          /**
           * Returns the css classes for the data table.
           * @param  {scope}
           * @return {style object}
           */
          value: function tableCss(scope) {
            return {
              'fixed': scope.options.scrollbarV,
              'selectable': scope.options.selectable,
              'checkboxable': scope.options.checkboxSelection
            };
          }
        }, {
          key: 'adjustColumns',

          /**
           * Adjusts the column widths to handle greed/etc.
           * @return {[type]}
           */
          value: function adjustColumns() {
            // todo: combine these
            if (this.$scope.options.forceFillColumns) {
              ForceFillColumnWidths(this.$scope.options.columns, this.$scope.options.internal.innerWidth);
            } else {
              AdjustColumnWidths(this.$scope.options.columns, this.$scope.options.internal.innerWidth);
            }
          }
        }, {
          key: 'calculatePageSize',

          /**
           * Calculates the page size given the height * row height.
           * @return {[type]}
           */
          value: function calculatePageSize() {
            this.$scope.options.paging.size = Math.ceil(this.$scope.options.internal.bodyHeight / this.$scope.options.rowHeight) + 1;
          }
        }, {
          key: 'onSort',

          /**
           * Sorts the values of the grid for client side sorting.
           * @param  {scope}
           */
          value: function onSort(scope) {
            if (!scope.values) return;

            var sorts = scope.options.columns.filter(function (c) {
              return c.sort;
            });

            if (sorts.length) {
              if (this.$scope.onSort) {
                this.$scope.onSort({ sorts: sorts });
              }

              var clientSorts = [];
              for (var i = 0, len = sorts.length; i < len; i++) {
                var c = sorts[i];
                if (c.comparator !== false) {
                  var dir = c.sort === 'asc' ? '' : '-';
                  clientSorts.push(dir + c.prop);
                }
              }

              if (clientSorts.length) {
                var _scope$values;

                // todo: more ideal to just resort vs splice and repush
                // but wasn't responding to this change ...
                var sortedValues = this.$filter('orderBy')(scope.values, clientSorts);
                scope.values.splice(0, scope.values.length);
                (_scope$values = scope.values).push.apply(_scope$values, _toConsumableArray(sortedValues));
              }
            }

            BodyHelper.setYOffset(0);
          }
        }, {
          key: 'onTreeToggle',

          /**
           * Invoked when a tree is collasped/expanded
           * @param  {scope}
           * @param  {row model}
           * @param  {cell model}
           */
          value: function onTreeToggle(scope, row, cell) {
            scope.onTreeToggle({
              row: row,
              cell: cell
            });
          }
        }, {
          key: 'onBodyPage',

          /**
           * Invoked when the body triggers a page change.
           * @param  {scope}
           * @param  {offset}
           * @param  {size}
           */
          value: function onBodyPage(scope, offset, size) {
            scope.onPage({
              offset: offset,
              size: size
            });
          }
        }, {
          key: 'onFooterPage',

          /**
           * Invoked when the footer triggers a page change.
           * @param  {scope}
           * @param  {offset}
           * @param  {size}
           */
          value: function onFooterPage(scope, offset, size) {
            var pageBlockSize = scope.options.rowHeight * size,
                offsetY = pageBlockSize * offset;

            BodyHelper.setYOffset(offsetY);

            scope.onPage({
              offset: offset,
              size: size
            });
          }
        }, {
          key: 'onHeaderCheckboxChange',

          /**
           * Invoked when the header checkbox directive has changed.
           * @param  {scope}
           */
          value: function onHeaderCheckboxChange(scope) {
            if (scope.values) {
              var matches = scope.selected.length === scope.values.length;
              scope.selected.splice(0, scope.selected.length);

              if (!matches) {
                var _scope$selected;

                (_scope$selected = scope.selected).push.apply(_scope$selected, _toConsumableArray(scope.values));
              }
            }
          }
        }, {
          key: 'isAllRowsSelected',

          /**
           * Returns if all the rows are selected
           * @param  {scope}  scope
           * @return {Boolean} if all selected
           */
          value: function isAllRowsSelected(scope) {
            if (!scope.values) return false;
            return scope.selected.length === scope.values.length;
          }
        }, {
          key: 'onResize',

          /**
           * Occurs when a header directive triggered a resize event
           * @param  {object} scope
           * @param  {object} column
           * @param  {int} width
           */
          value: function onResize(scope, column, width) {
            var idx = scope.options.columns.indexOf(column);
            if (idx > -1) {
              scope.options.columns[idx].width = width;
              this.calculateColumns(scope.options.columns);
            }
          }
        }]);

        return DataTableController;
      })();

      ;

      module.exports = window.angular;

      _export('default', angular.module('data-table', [Pager.name]).controller('DataTable', DataTableController).directive('dt', DataTableDirective).directive('resizable', Resizable).directive('sortable', Sortable).constant('debounce', debounce).constant('throttle', throttle).controller('HeaderController', HeaderController).directive('dtHeader', HeaderDirective).controller('HeaderCellController', HeaderCellController).directive('dtHeaderCell', HeaderCellDirective).controller('BodyController', BodyController).directive('dtBody', BodyDirective).controller('RowController', RowController).directive('dtRow', RowDirective).controller('GroupRowController', GroupRowController).directive('dtGroupRow', GroupRowDirective).controller('CellController', CellController).directive('dtCell', CellDirective).controller('FooterController', FooterController).directive('dtFooter', FooterDirective));
    }
  };
});