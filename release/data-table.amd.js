define('data-table', ['exports', 'module', 'angular', './utils/polyfill', './utils/throttle', './utils/resizable', './utils/sortable', './utils/math', 'utils/utils', './defaults', './components/header/header', './components/header/header-cell', './components/body/body', './components/body/row', './components/body/group-row', './components/body/cell', './components/footer/footer', './components/footer/pager'], function (exports, module, _angular, _utilsPolyfill, _utilsThrottle, _utilsResizable, _utilsSortable, _utilsMath, _utilsUtils, _defaults, _componentsHeaderHeader, _componentsHeaderHeaderCell, _componentsBodyBody, _componentsBodyRow, _componentsBodyGroupRow, _componentsBodyCell, _componentsFooterFooter, _componentsFooterPager) {
  'use strict';

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var _angular2 = _interopRequireDefault(_angular);

  var DataTableController = (function () {

    /**
     * Creates an instance of the DataTable Controller
     * @param  {scope}
     * @param  {filter}
     */
    /*@ngInject*/

    function DataTableController($scope, $filter, $log) {
      var _this = this;

      _classCallCheck(this, DataTableController);

      _angular2['default'].extend(this, {
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

        var options = _angular2['default'].extend(_angular2['default'].copy(_defaults.TableDefaults), $scope.options);

        options.paging = _angular2['default'].extend(_angular2['default'].copy(_defaults.TableDefaults.paging), $scope.options.paging);

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
          column = _angular2['default'].extend(_angular2['default'].copy(_defaults.ColumnDefaults), column);

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
        this.columnsByPin = (0, _utilsUtils.ColumnsByPin)(columns);
        this.columnWidths = (0, _utilsUtils.ColumnGroupWidths)(this.columnsByPin, columns);
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
          (0, _utilsMath.ForceFillColumnWidths)(this.$scope.options.columns, this.$scope.options.internal.innerWidth);
        } else {
          (0, _utilsMath.AdjustColumnWidths)(this.$scope.options.columns, this.$scope.options.internal.innerWidth);
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

        _componentsBodyBody.BodyHelper.setYOffset(0);
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

        _componentsBodyBody.BodyHelper.setYOffset(offsetY);
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
            _angular2['default'].element($window).bind('resize', throttle(function () {
              $timeout(resize);
            }));
          }
        };
      }
    };
  };

  module.exports = _angular2['default'].module('data-table', []).controller('DataTable', DataTableController).directive('dt', DataTableDirective).directive('resizable', _utilsResizable.Resizable).directive('sortable', _utilsSortable.Sortable).constant('debounce', _utilsThrottle.debounce).constant('throttle', _utilsThrottle.throttle).controller('HeaderController', _componentsHeaderHeader.HeaderController).directive('dtHeader', _componentsHeaderHeader.HeaderDirective).controller('HeaderCellController', _componentsHeaderHeaderCell.HeaderCellController).directive('dtHeaderCell', _componentsHeaderHeaderCell.HeaderCellDirective).controller('BodyController', _componentsBodyBody.BodyController).directive('dtBody', _componentsBodyBody.BodyDirective).controller('RowController', _componentsBodyRow.RowController).directive('dtRow', _componentsBodyRow.RowDirective).controller('GroupRowController', _componentsBodyGroupRow.GroupRowController).directive('dtGroupRow', _componentsBodyGroupRow.GroupRowDirective).controller('CellController', _componentsBodyCell.CellController).directive('dtCell', _componentsBodyCell.CellDirective).controller('FooterController', _componentsFooterFooter.FooterController).directive('dtFooter', _componentsFooterFooter.FooterDirective).controller('PagerController', _componentsFooterPager.PagerController).directive('dtPager', _componentsFooterPager.PagerDirective);
});
define('defaults', ['exports'], function (exports) {
  /**
   * Default Table Options
   * @type {object}
   */
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  var TableDefaults = Object.freeze({

    // Enable vertical scrollbars
    scrollbarV: true,

    // Enable horz scrollbars
    // scrollbarH: true,

    // The row height, which is necessary
    // to calculate the height for the lazy rendering.
    rowHeight: 30,

    // Expands the columns to fill the given width.
    // Can NOT be used with flex grow attributes
    forceFillColumns: false,

    // Loading message presented when the array is undefined
    loadingMessage: 'Loading...',

    // Message to show when array is presented
    // but contains no values
    emptyMessage: 'No data to display',

    // The minimum header height in pixels.
    // pass falsey for no header
    headerHeight: 50,

    // The minimum footer height in pixels.
    // pass falsey for no footer
    footerHeight: 0,

    paging: {
      // if external paging is turned on
      externalPaging: false,

      // Page size
      size: undefined,

      // Total count
      count: 0,

      // Page offset
      offset: 0
    },

    // if users can select itmes
    selectable: false,

    // if users can select mutliple items
    multiSelect: false,

    // checkbox selection vs row click
    checkboxSelection: false,

    // if you can reorder columns
    reorderable: true,

    internal: {
      offsetX: 0,
      offsetY: 0,
      innerWidth: 0,
      bodyHeight: 300
    }

  });

  exports.TableDefaults = TableDefaults;
  /**
   * Default Column Options
   * @type {object}
   */
  var ColumnDefaults = Object.freeze({

    // pinned to the left
    frozenLeft: false,

    // pinned to the right
    frozenRight: false,

    // body cell css class name
    className: undefined,

    // header cell css class name
    heaerClassName: undefined,

    // The grow factor relative to other columns. Same as the flex-grow
    // API from http://www.w3.org/TR/css3-flexbox/. Basically,
    // take any available extra width and distribute it proportionally
    // according to all columns' flexGrow values.
    flexGrow: 0,

    // Minimum width of the column.
    minWidth: undefined,

    //Maximum width of the column.
    maxWidth: undefined,

    // The width of the column, by default (in pixels).
    width: 150,

    // If yes then the column can be resized, otherwise it cannot.
    resizable: true,

    // Custom sort comparator
    // pass false if you want to server sort
    comparator: undefined,

    // If yes then the column can be sorted.
    sortable: true,

    // Default sort asecending/descending for the column
    sort: undefined,

    // The cell renderer that returns content for table column header
    headerRenderer: undefined,

    // The cell renderer function(scope, elm) that returns React-renderable content for table cell.
    cellRenderer: undefined,

    // The getter function(value) that returns the cell data for the cellRenderer.
    // If not provided, the cell data will be collected from row data instead.
    cellDataGetter: undefined,

    // Adds +/- button and makes a secondary call to load nested data
    isTreeColumn: false,

    // Adds the checkbox selection to the column
    isCheckboxColumn: false,

    // Toggles the checkbox column in the header
    // for selecting all values given to the grid
    headerCheckbox: false

  });
  exports.ColumnDefaults = ColumnDefaults;
});
define("utils/keys", ["exports"], function (exports) {
  /**
   * Shortcut for key handlers
   * @type {Object}
   */
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var KEYS = {
    BACKSPACE: 8,
    TAB: 9,
    RETURN: 13,
    ALT: 18,
    ESC: 27,
    SPACE: 32,
    PAGE_UP: 33,
    PAGE_DOWN: 34,
    END: 35,
    HOME: 36,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    DELETE: 46,
    COMMA: 188,
    PERIOD: 190,
    A: 65,
    Z: 90,
    ZERO: 48,
    NUMPAD_0: 96,
    NUMPAD_9: 105
  };
  exports.KEYS = KEYS;
});
define('utils/math', ['exports', 'angular', 'utils/utils'], function (exports, _angular, _utilsUtils) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  exports.ColumnTotalWidth = ColumnTotalWidth;
  exports.GetTotalFlexGrow = GetTotalFlexGrow;
  exports.DistributeFlexWidth = DistributeFlexWidth;
  exports.AdjustColumnWidths = AdjustColumnWidths;
  exports.ForceFillColumnWidths = ForceFillColumnWidths;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _angular2 = _interopRequireDefault(_angular);

  /**
   * Calculates the total width of all columns and their groups
   * @param {int}
   */

  function ColumnTotalWidth(columns) {
    var totalWidth = 0;

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = columns[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var c = _step.value;

        totalWidth += c.width;
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator['return']) {
          _iterator['return']();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return totalWidth;
  }

  /**
   * Calculates the Total Flex Grow width.
   * @param {array}
   */

  function GetTotalFlexGrow(columns) {
    var totalFlexGrow = 0;

    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = columns[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var c = _step2.value;

        totalFlexGrow += c.flexGrow || 0;
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2['return']) {
          _iterator2['return']();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }

    return totalFlexGrow;
  }

  /**
   * Distributes the flex widths to the columns
   * @param {array} columns
   * @param {int} flex width
   */

  function DistributeFlexWidth(columns, flexWidth) {
    if (flexWidth <= 0) {
      return {
        columns: columns,
        width: ColumnTotalWidth(columns)
      };
    }

    var remainingFlexGrow = GetTotalFlexGrow(columns),
        remainingFlexWidth = flexWidth,
        totalWidth = 0;

    for (var i = 0, len = columns.length; i < len; i++) {
      var column = columns[i];

      if (!column.flexGrow) {
        totalWidth += column.width;
        return;
      }

      var columnFlexWidth = Math.floor(column.flexGrow / remainingFlexGrow * remainingFlexWidth),
          newColumnWidth = Math.floor(column.width + columnFlexWidth);

      if (column.minWidth && newColumnWidth < column.minWidth) {
        newColumnWidth = column.minWidth;
      }

      if (column.maxWidth && newColumnWidth > column.maxWidth) {
        newColumnWidth = column.maxWidth;
      }

      totalWidth += newColumnWidth;
      remainingFlexGrow -= column.flexGrow;
      remainingFlexWidth -= columnFlexWidth;

      column.width = newColumnWidth;
    }

    return {
      width: totalWidth
    };
  }

  /**
   * Adjusts the column widths.
   * Inspired by: https://github.com/facebook/fixed-data-table/blob/master/src/FixedDataTableWidthHelper.js
   * @param {array} all columns
   * @param {int} width
   */

  function AdjustColumnWidths(allColumns, expectedWidth) {
    var columnsWidth = ColumnTotalWidth(allColumns),
        remainingFlexGrow = GetTotalFlexGrow(allColumns),
        remainingFlexWidth = Math.max(expectedWidth - columnsWidth, 0),
        colsByGroup = (0, _utilsUtils.ColumnsByPin)(allColumns);

    _angular2['default'].forEach(colsByGroup, function (cols) {
      var columnGroupFlexGrow = GetTotalFlexGrow(cols),
          columnGroupFlexWidth = Math.floor(columnGroupFlexGrow / remainingFlexGrow * remainingFlexWidth),
          newColumnSettings = DistributeFlexWidth(cols, columnGroupFlexWidth);

      remainingFlexGrow -= columnGroupFlexGrow;
      remainingFlexWidth -= columnGroupFlexWidth;
    });
  }

  /**
   * Forces the width of the columns to 
   * distribute equally but overflowing when nesc.
   * @param {array} allColumns 
   * @param {int} expectedWidth
   */

  function ForceFillColumnWidths(allColumns, expectedWidth) {
    var colsByGroup = (0, _utilsUtils.ColumnsByPin)(allColumns),
        widthsByGroup = (0, _utilsUtils.ColumnGroupWidths)(colsByGroup, allColumns),
        availableWidth = expectedWidth - (widthsByGroup.left + widthsByGroup.right);

    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      for (var _iterator3 = colsByGroup.center[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        var _column = _step3.value;

        if (_column.$$oldWidth) {
          _column.width = _column.$$oldWidth;
        }
      }
    } catch (err) {
      _didIteratorError3 = true;
      _iteratorError3 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion3 && _iterator3['return']) {
          _iterator3['return']();
        }
      } finally {
        if (_didIteratorError3) {
          throw _iteratorError3;
        }
      }
    }

    var contentWidth = ColumnTotalWidth(colsByGroup.center),
        remainingWidth = availableWidth - contentWidth,
        additionWidthPerColumn = Math.floor(remainingWidth / colsByGroup.center.length),
        oldLargerThanNew = contentWidth > widthsByGroup.center;

    for (var i = 0, len = allColumns.length; i < len; i++) {
      var column = allColumns[i];
      if (!column.frozenLeft && !column.frozenRight) {
        // cache first size
        if (!column.$$oldWidth) {
          column.$$oldWidth = column.width;
        }

        var newSize = column.width + additionWidthPerColumn;
        column.width = oldLargerThanNew ? column.$$oldWidth : newSize;
      }
    }
  }
});
define("utils/polyfill", ["exports"], function (exports) {
  /**
   * Array.prototype.find()
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
   */
  "use strict";

  (function () {
    function polyfill(fnName) {
      if (!Array.prototype[fnName]) {
        Array.prototype[fnName] = function (predicate /*, thisArg */) {
          var i,
              len,
              test,
              thisArg = arguments[1];

          if (typeof predicate !== "function") {
            throw new TypeError();
          }

          test = !thisArg ? predicate : function () {
            return predicate.apply(thisArg, arguments);
          };

          for (i = 0, len = this.length; i < len; i++) {
            if (test(this[i], i, this) === true) {
              return fnName === "find" ? this[i] : i;
            }
          }

          if (fnName !== "find") {
            return -1;
          }
        };
      }
    }

    for (var i in {
      find: 1,
      findIndex: 1
    }) {
      polyfill(i);
    }
  })();
});
define('utils/resizable', ['exports'], function (exports) {
  /**
   * Resizable directive
   * http://stackoverflow.com/questions/18368485/angular-js-resizable-div-directive
   * @param {object}
   * @param {function}
   * @param {function}
   */
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  exports.Resizable = Resizable;

  function Resizable($document, debounce, $timeout) {
    return {
      restrict: 'AEC',
      scope: {
        isResizable: '=resizable',
        minWidth: '=',
        maxWidth: '=',
        onResize: '&'
      },
      link: function link($scope, $element, $attrs) {
        if ($scope.isResizable) {
          $element.addClass('resizable');
        }

        var handle = angular.element('<span class="dt-resize-handle" title="Resize"></span>'),
            parent = $element.parent();

        handle.on('mousedown', function (event) {
          if (!$element[0].classList.contains('resizable')) {
            return false;
          }

          event.stopPropagation();
          event.preventDefault();

          $document.on('mousemove', mousemove);
          $document.on('mouseup', mouseup);
        });

        function mousemove(event) {
          var width = parent[0].scrollWidth,
              newWidth = width + event.movementX;

          if ((!$scope.minWidth || newWidth >= $scope.minWidth) && (!$scope.maxWidth || newWidth <= $scope.maxWidth)) {
            parent.css({
              width: newWidth + 'px'
            });
          }
        }

        function mouseup() {
          if ($scope.onResize) {
            $timeout(function () {
              $scope.onResize({ width: parent[0].scrollWidth });
            });
          }

          $document.unbind('mousemove', mousemove);
          $document.unbind('mouseup', mouseup);
        }

        $element.append(handle);
      }
    };
  }

  ;
});
define('utils/sortable', ['exports', 'angular'], function (exports, _angular) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  exports.Sortable = Sortable;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _angular2 = _interopRequireDefault(_angular);

  /**
   * Sortable Directive
   * http://jsfiddle.net/RubaXa/zLq5J/3/
   * https://jsfiddle.net/hrohxze0/6/
   * @param {function}
   */

  function Sortable($timeout) {
    return {
      restrict: 'AC',
      scope: {
        isSortable: '=sortable',
        onSortableSort: '&'
      },
      link: function link($scope, $element, $attrs) {
        var rootEl = $element[0],
            dragEl,
            nextEl,
            dropEl;

        $timeout(function () {
          _angular2['default'].forEach(rootEl.children, function (el) {
            el.draggable = true;
          });
        });

        function isbefore(a, b) {
          if (a.parentNode == b.parentNode) {
            for (var cur = a; cur; cur = cur.previousSibling) {
              if (cur === b) {
                return true;
              }
            }
          }
          return false;
        };

        function onDragEnter(e) {
          var target = e.target;
          if (isbefore(dragEl, target)) {
            target.parentNode.insertBefore(dragEl, target);
          } else if (target.nextSibling && target.hasAttribute('draggable')) {
            target.parentNode.insertBefore(dragEl, target.nextSibling);
          }
        };

        function onDragEnd(evt) {
          evt.preventDefault();

          dragEl.classList.remove('dt-clone');

          $element.off('dragend', onDragEnd);
          $element.off('dragenter', onDragEnter);

          if (nextEl !== dragEl.nextSibling) {
            $scope.onSortableSort({
              event: evt,
              childScope: _angular2['default'].element(dragEl).scope()
            });
          }
        };

        function onDragStart(evt) {
          if (!$scope.isSortable) return false;

          dragEl = evt.target;
          nextEl = dragEl.nextSibling;
          dragEl.classList.add('dt-clone');

          evt.dataTransfer.effectAllowed = 'move';
          evt.dataTransfer.setData('Text', dragEl.textContent);

          $element.on('dragenter', onDragEnter);
          $element.on('dragend', onDragEnd);
        };

        $element.on('dragstart', onDragStart);

        $scope.$on('$destroy', function () {
          $element.off('dragstart', onDragStart);
        });
      }
    };
  }
});
define('utils/throttle', ['exports', 'angular'], function (exports, _angular) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  exports.debounce = debounce;
  exports.throttle = throttle;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _angular2 = _interopRequireDefault(_angular);

  /**
   * Debounce helper
   * @param  {function}
   * @param  {int}
   * @param  {boolean}
   */

  function debounce(func, wait, immediate) {
    var timeout, args, context, timestamp, result;
    return function () {
      context = this;
      args = arguments;
      timestamp = new Date();
      var later = function later() {
        var last = new Date() - timestamp;
        if (last < wait) {
          timeout = setTimeout(later, wait - last);
        } else {
          timeout = null;
          if (!immediate) result = func.apply(context, args);
        }
      };
      var callNow = immediate && !timeout;
      if (!timeout) {
        timeout = setTimeout(later, wait);
      }
      if (callNow) result = func.apply(context, args);
      return result;
    };
  }

  ;

  /**
   * Throttle helper
   * @param  {function}
   * @param  {boolean}
   * @param  {object}
   */

  function throttle(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    options || (options = {});
    var later = function later() {
      previous = options.leading === false ? 0 : new Date();
      timeout = null;
      result = func.apply(context, args);
    };
    return function () {
      var now = new Date();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0) {
        clearTimeout(timeout);
        timeout = null;
        previous = now;
        result = func.apply(context, args);
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  }

  ;
});
define('utils/utils', ['exports', 'utils/math'], function (exports, _utilsMath) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  exports.ColumnsByPin = ColumnsByPin;
  exports.ColumnGroupWidths = ColumnGroupWidths;
  exports.DeepValueGetter = DeepValueGetter;

  /**
   * Shim layer with setTimeout fallback
   * http://www.html5rocks.com/en/tutorials/speed/animations/
   */
  var requestAnimFrame = (function () {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
      window.setTimeout(callback, 1000 / 60);
    };
  })();

  exports.requestAnimFrame = requestAnimFrame;
  /**
   * Returns the columns by pin.
   * @param {array} colsumns
   */

  function ColumnsByPin(cols) {
    var ret = {
      left: [],
      center: [],
      right: []
    };

    for (var i = 0, len = cols.length; i < len; i++) {
      var c = cols[i];
      if (c.frozenLeft) {
        ret.left.push(c);
      } else if (c.frozenRight) {
        ret.right.push(c);
      } else {
        ret.center.push(c);
      }
    }

    return ret;
  }

  ;

  /**
   * Returns the widths of all group sets of a column
   * @param {object} groups 
   * @param {array} all 
   */

  function ColumnGroupWidths(groups, all) {
    return {
      left: (0, _utilsMath.ColumnTotalWidth)(groups.left),
      center: (0, _utilsMath.ColumnTotalWidth)(groups.center),
      right: (0, _utilsMath.ColumnTotalWidth)(groups.right),
      total: (0, _utilsMath.ColumnTotalWidth)(all)
    };
  }

  /**
   * Returns a deep object given a string. zoo['animal.type']
   * @param {object} obj  
   * @param {string} path 
   */

  function DeepValueGetter(obj, path) {
    if (!obj || !path) return obj;

    var current = obj,
        split = path.split('.');

    if (split.length) {
      for (var i = 0, len = split.length; i < len; i++) {
        current = current[split[i]];
      }
    }

    return current;
  }

  ;
});
define('components/body/body', ['exports', 'angular', 'utils/utils', 'utils/keys'], function (exports, _angular, _utilsUtils, _utilsKeys) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  exports.BodyDirective = BodyDirective;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var _angular2 = _interopRequireDefault(_angular);

  var BodyController = (function () {

    /**
     * A tale body controller
     * @param  {$scope}
     * @param  {$timeout}
     * @param  {throttle}
     * @return {BodyController}
     */
    /*@ngInject*/

    function BodyController($scope, $timeout, throttle) {
      var _this = this;

      _classCallCheck(this, BodyController);

      _angular2['default'].extend(this, {
        $scope: $scope,
        options: $scope.options,
        selected: $scope.selected
      });

      this.rows = [];
      this._viewportRowsStart = 0;
      this._viewportRowsEnd = 0;

      this.treeColumn = $scope.options.columns.find(function (c) {
        return c.isTreeColumn;
      });

      this.groupColumn = $scope.options.columns.find(function (c) {
        return c.group;
      });

      if (this.options.scrollbarV) {
        $scope.$watch('options.internal.offsetY', throttle(this.getRows.bind(this), 10));
      }

      $scope.$watchCollection('values', function (newVal, oldVal) {
        if (newVal) {
          if (!_this.options.paging.externalPaging) {
            _this.options.paging.count = newVal.length;
          }

          _this.count = _this.options.paging.count;

          if (_this.treeColumn || _this.groupColumn) {
            _this.buildRowsByGroup();
          }

          if (_this.options.scrollbarV) {
            _this.getRows();
          } else {
            var _rows;

            var values = $scope.values;
            if (_this.treeColumn) {
              values = _this.buildTree();
            } else if (_this.groupColumn) {
              values = _this.buildGroups();
            }
            _this.rows.splice(0, _this.rows.length);
            (_rows = _this.rows).push.apply(_rows, _toConsumableArray(values));
          }
        }
      });

      if (this.options.scrollbarV) {
        $scope.$watch('options.internal.offsetY', this.updatePage.bind(this));
        $scope.$watch('options.paging.offset', function (newVal) {
          $scope.onPage({
            offset: newVal,
            size: _this.options.paging.size
          });
        });
      }
    }
    BodyController.$inject = ["$scope", "$timeout", "throttle"];

    _createClass(BodyController, [{
      key: 'getFirstLastIndexes',

      /**
       * Gets the first and last indexes based on the offset, row height, page size, and overall count.
       * @return {object}
       */
      value: function getFirstLastIndexes() {
        var firstRowIndex = Math.max(Math.floor((this.$scope.options.internal.offsetY || 0) / this.options.rowHeight, 0), 0),
            endIndex = Math.min(firstRowIndex + this.options.paging.size, this.count);

        return {
          first: firstRowIndex,
          last: endIndex
        };
      }
    }, {
      key: 'updatePage',

      /**
       * Updates the page's offset given the scroll position.
       * @param  {paging object}
       */
      value: function updatePage() {
        var idxs = this.getFirstLastIndexes(),
            curPage = Math.ceil(idxs.first / this.options.paging.size);
        this.options.paging.offset = curPage;
      }
    }, {
      key: 'buildRowsByGroup',

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
      value: function buildRowsByGroup() {
        this.index = {};
        this.rowsByGroup = {};

        var parentProp = this.treeColumn ? this.treeColumn.relationProp : this.groupColumn.prop;

        for (var i = 0, len = this.$scope.values.length; i < len; i++) {
          var row = this.$scope.values[i];
          // build groups
          var relVal = row[parentProp];
          if (relVal) {
            if (this.rowsByGroup[relVal]) {
              this.rowsByGroup[relVal].push(row);
            } else {
              this.rowsByGroup[relVal] = [row];
            }
          }

          // build indexes
          if (this.treeColumn) {
            var prop = this.treeColumn.prop;
            this.index[row[prop]] = row;

            if (row[parentProp] === undefined) {
              row.$$depth = 0;
            } else {
              var parent = this.index[row[parentProp]];
              row.$$depth = parent.$$depth + 1;
              if (parent.$$children) {
                parent.$$children.push(row[prop]);
              } else {
                parent.$$children = [row[prop]];
              }
            }
          }
        }
      }
    }, {
      key: 'buildGroups',

      /**
       * Rebuilds the groups based on what is expanded.
       * This function needs some optimization, todo for future release.
       * @return {Array} the temp array containing expanded rows
       */
      value: function buildGroups() {
        var _this2 = this;

        var temp = [];

        _angular2['default'].forEach(this.rowsByGroup, function (v, k) {
          temp.push({
            name: k,
            group: true
          });

          if (_this2.$scope.expanded[k]) {
            temp.push.apply(temp, _toConsumableArray(v));
          }
        });

        return temp;
      }
    }, {
      key: 'buildTree',

      /**
       * Creates a tree of the existing expanded values
       * @return {array} the built tree
       */
      value: function buildTree() {
        var count = 0,
            temp = [];

        for (var i = 0, len = this.$scope.values.length; i < len; i++) {
          var row = this.$scope.values[i],
              relVal = row[this.treeColumn.relationProp],
              keyVal = row[this.treeColumn.prop],
              rows = this.rowsByGroup[keyVal],
              expanded = this.$scope.expanded[keyVal];

          if (!relVal) {
            count++;
            temp.push(row);
          }

          if (rows && rows.length) {
            if (expanded) {
              temp.push.apply(temp, _toConsumableArray(rows));
              count = count + rows.length;
            }
          }
        }

        return temp;
      }
    }, {
      key: 'getRows',

      /**
       * Creates the intermediate collection that is shown in the view.
       * @param  {boolean} refresh - bust the tree/group cache
       */
      value: function getRows(refresh) {
        // only proceed when we have pre-aggregated the values
        if ((this.treeColumn || this.groupColumn) && !this.rowsByGroup) {
          return false;
        }

        var temp;

        if (this.treeColumn) {
          temp = this.treeTemp || [];
          // cache the tree build
          if (refresh || !this.treeTemp) {
            this.treeTemp = temp = this.buildTree();
            this.count = temp.length;

            // have to force reset, optimize this later
            this.rows.splice(0, this.rows.length);
          }
        } else if (this.groupColumn) {
          temp = this.groupsTemp || [];
          // cache the group build
          if (refresh || !this.groupsTemp) {
            this.groupsTemp = temp = this.buildGroups();
            this.count = temp.length;
          }
        } else {
          temp = this.$scope.values;
        }

        var idx = 0,
            indexes = this.getFirstLastIndexes(),
            rowIndex = indexes.first;

        while (rowIndex < indexes.last || this.options.internal.bodyHeight < this._viewportHeight && rowIndex < this.count) {

          var row = temp[rowIndex];
          if (row) {
            row.$$index = rowIndex;
            this.rows[idx] = row;
          }

          idx++;
          this._viewportRowsEnd = rowIndex++;
        }
      }
    }, {
      key: 'styles',

      /**
       * Returns the styles for the table body directive.
       * @return {object}
       */
      value: function styles() {
        var styles = {
          width: this.options.internal.innerWidth + 'px'
        };

        if (!this.options.scrollbarV) {
          styles.overflowY = 'hidden';
        } else if (this.options.scrollbarH === false) {
          styles.overflowX = 'hidden';
        }

        if (this.options.scrollbarV) {
          styles.height = this.options.internal.bodyHeight + 'px';
        }

        return styles;
      }
    }, {
      key: 'rowStyles',

      /**
       * Returns the styles for the row diretive.
       * @param  {scope}
       * @param  {row}
       * @return {styles object}
       */
      value: function rowStyles(scope, row) {
        var styles = {
          height: scope.options.rowHeight + 'px'
        };

        if (scope.options.scrollbarV) {
          styles.transform = 'translate3d(0, ' + row.$$index * scope.options.rowHeight + 'px, 0)';
        }

        return styles;
      }
    }, {
      key: 'groupRowStyles',

      /**
       * Builds the styles for the row group directive
       * @param  {object} scope 
       * @param  {object} row   
       * @return {object} styles
       */
      value: function groupRowStyles(scope, row) {
        var styles = this.rowStyles(scope, row);
        styles.width = scope.columnWidths.total + 'px';
        return styles;
      }
    }, {
      key: 'rowClasses',

      /**
       * Returns the css classes for the row directive.
       * @param  {scope}
       * @param  {row}
       * @return {css class object}
       */
      value: function rowClasses(scope, row) {
        var styles = {
          'selected': this.isSelected(row)
        };

        if (this.treeColumn) {
          // if i am a child
          styles['dt-leaf'] = this.rowsByGroup[row[this.treeColumn.relationProp]];
          // if i have children
          styles['dt-has-leafs'] = this.rowsByGroup[row[this.treeColumn.prop]];
          // the depth
          styles['dt-depth-' + row.$$depth] = true;
        }

        return styles;
      }
    }, {
      key: 'isSelected',

      /**
       * Returns if the row is selected
       * @param  {row}
       * @return {Boolean}
       */
      value: function isSelected(row) {
        var selected = false;

        if (this.options.selectable) {
          if (this.options.multiSelect) {
            selected = this.selected.indexOf(row) > -1;
          } else {
            selected = this.selected === row;
          }
        }

        return selected;
      }
    }, {
      key: 'keyDown',

      /**
       * Handler for the keydown on a row
       * @param  {event}
       * @param  {index}
       * @param  {row}
       */
      value: function keyDown(ev, index, row) {
        ev.preventDefault();

        if (ev.keyCode === _utilsKeys.KEYS.DOWN) {
          var next = ev.target.nextElementSibling;
          if (next) {
            next.focus();
          }
        } else if (ev.keyCode === _utilsKeys.KEYS.UP) {
          var prev = ev.target.previousElementSibling;
          if (prev) {
            prev.focus();
          }
        } else if (ev.keyCode === _utilsKeys.KEYS.RETURN) {
          this.selectRow(index, row);
        }
      }
    }, {
      key: 'rowClicked',

      /**
       * Handler for the row click event
       * @param  {event}
       * @param  {index}
       * @param  {row}
       */
      value: function rowClicked(event, index, row) {
        if (!this.options.checkboxSelection) {
          event.preventDefault();

          this.selectRow(index, row);

          if (this.$scope.onSelect) {
            this.$scope.onSelect({ row: row });
          }
        }
      }
    }, {
      key: 'selectRow',

      /**
       * Selects a row and places in the selection collection
       * @param  {index}
       * @param  {row}
       */
      value: function selectRow(index, row) {
        if (this.options.selectable) {
          if (this.options.multiSelect) {
            var isCtrlKeyDown = event.ctrlKey || event.metaKey,
                isShiftKeyDown = event.shiftKey;

            if (isShiftKeyDown) {
              this.selectRowsBetween(index, row);
            } else {
              var idx = this.selected.indexOf(row);
              if (idx > -1) {
                this.selected.splice(idx, 1);
              } else {
                this.selected.push(row);
              }
            }
            this.prevIndex = index;
          } else {
            this.selected = row;
          }
        }
      }
    }, {
      key: 'selectRowsBetween',

      /**
       * Selectes the rows between a index.  Used for shift click selection.
       * @param  {index}
       */
      value: function selectRowsBetween(index) {
        var reverse = index < this.prevIndex;
        for (var i = 0, len = this.rows.length; i < len; i++) {
          var row = this.rows[i],
              greater = i >= this.prevIndex && i <= index,
              lesser = i <= this.prevIndex && i >= index;

          if (reverse && lesser || !reverse && greater) {
            var idx = this.selected.indexOf(row);
            if (idx === -1) {
              this.selected.push(row);
            }
          }
        }
      }
    }, {
      key: 'scrollerStyles',

      /**
       * Returns the virtual row height.
       * @return {[height]}
       */
      value: function scrollerStyles() {
        return {
          height: this.count * this.options.rowHeight + 'px'
        };
      }
    }, {
      key: 'getRowValue',

      /**
       * Returns the row model for the index in the view.
       * @param  {index}
       * @return {row model}
       */
      value: function getRowValue(idx) {
        return this.rows[idx];
      }
    }, {
      key: 'getRowExpanded',

      /**
       * Calculates if a row is expanded or collasped for tree grids.
       * @param  {scope}
       * @param  {row}
       * @return {boolean}
       */
      value: function getRowExpanded(scope, row) {
        if (this.treeColumn) {
          return scope.expanded[row[this.treeColumn.prop]];
        } else if (this.groupColumn) {
          return scope.expanded[row.name];
        }
      }
    }, {
      key: 'getRowHasChildren',

      /**
       * Calculates if the row has children
       * @param  {row}
       * @return {boolean}
       */
      value: function getRowHasChildren(row) {
        if (!this.treeColumn) return;
        var children = this.rowsByGroup[row[this.treeColumn.prop]];
        return children !== undefined || children && !children.length;
      }
    }, {
      key: 'onTreeToggle',

      /**
       * Tree toggle event from a cell
       * @param  {scope}
       * @param  {row model}
       * @param  {cell model}
       */
      value: function onTreeToggle(scope, row, cell) {
        var val = row[this.treeColumn.prop];
        scope.expanded[val] = !scope.expanded[val];

        if (this.options.scrollbarV) {
          this.getRows(true);
        } else {
          var _rows2;

          var values = this.buildTree();
          this.rows.splice(0, this.rows.length);
          (_rows2 = this.rows).push.apply(_rows2, _toConsumableArray(values));
        }

        scope.onTreeToggle({
          row: row,
          cell: cell
        });
      }
    }, {
      key: 'onCheckboxChange',

      /**
       * Invoked when a row directive's checkbox was changed.
       * @param  {index}
       * @param  {row}
       */
      value: function onCheckboxChange(index, row) {
        this.selectRow(index, row);
      }
    }, {
      key: 'onGroupToggle',

      /**
       * Invoked when the row group directive was expanded
       * @param  {object} scope 
       * @param  {object} row   
       */
      value: function onGroupToggle(scope, row) {
        scope.expanded[row.name] = !scope.expanded[row.name];

        if (this.options.scrollbarV) {
          this.getRows(true);
        } else {
          var _rows3;

          var values = this.buildGroups();
          this.rows.splice(0, this.rows.length);
          (_rows3 = this.rows).push.apply(_rows3, _toConsumableArray(values));
        }
      }
    }]);

    return BodyController;
  })();

  exports.BodyController = BodyController;

  /**
   * A helper for scrolling the body to a specific scroll position
   * when the footer pager is invoked.
   */
  var BodyHelper = (function () {
    var _elm;
    return {
      create: function create(elm) {
        _elm = elm;
      },
      setYOffset: function setYOffset(offsetY) {
        _elm[0].scrollTop = offsetY;
      }
    };
  })();

  exports.BodyHelper = BodyHelper;

  function BodyDirective($timeout) {
    return {
      restrict: 'E',
      controller: 'BodyController',
      controllerAs: 'body',
      scope: {
        columns: '=',
        columnWidths: '=',
        values: '=',
        options: '=',
        selected: '=',
        expanded: '=',
        onPage: '&',
        onTreeToggle: '&'
      },
      template: '\n      <div class="dt-body" ng-style="body.styles()">\n        <div class="dt-body-scroller" ng-style="body.scrollerStyles()">\n          <dt-group-row ng-repeat-start="r in body.rows track by $index"\n                        ng-if="r.group"\n                        ng-style="body.groupRowStyles(this, r)" \n                        on-group-toggle="body.onGroupToggle(this, group)"\n                        expanded="body.getRowExpanded(this, r)"\n                        tabindex="{{$index}}"\n                        value="r">\n          </dt-group-row>\n          <dt-row ng-repeat-end\n                  ng-if="!r.group"\n                  value="body.getRowValue($index)"\n                  tabindex="{{$index}}"\n                  columns="columns"\n                  column-widths="columnWidths"\n                  ng-keydown="body.keyDown($event, $index, r)"\n                  ng-click="body.rowClicked($event, $index, r)"\n                  on-tree-toggle="body.onTreeToggle(this, row, cell)"\n                  ng-class="body.rowClasses(this, r)"\n                  options="options"\n                  selected="body.isSelected(r)"\n                  on-checkbox-change="body.onCheckboxChange($index, row)"\n                  columns="body.columnsByPin"\n                  has-children="body.getRowHasChildren(r)"\n                  expanded="body.getRowExpanded(this, r)"\n                  ng-style="body.rowStyles(this, r)">\n          </dt-row>\n        </div>\n        <div ng-if="values && !values.length" \n             class="empty-row" \n             ng-bind="::options.emptyMessage">\n       </div>\n       <div ng-if="values === undefined" \n             class="loading-row"\n             ng-bind="::options.loadingMessage">\n       </div>\n      </div>',
      replace: true,
      link: function link($scope, $elm, $attrs, ctrl) {
        var ticking = false,
            lastScrollY = 0,
            lastScrollX = 0,
            helper = BodyHelper.create($elm);

        function update() {
          $timeout(function () {
            $scope.options.internal.offsetY = lastScrollY;
            $scope.options.internal.offsetX = lastScrollX;
            ctrl.updatePage();
          });

          ticking = false;
        };

        function requestTick() {
          if (!ticking) {
            (0, _utilsUtils.requestAnimFrame)(update);
            ticking = true;
          }
        };

        $elm.on('scroll', function (ev) {
          lastScrollY = this.scrollTop;
          lastScrollX = this.scrollLeft;
          requestTick();
        });
      }
    };
  }

  ;
});
define('components/body/cell', ['exports', 'angular'], function (exports, _angular) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  exports.CellDirective = CellDirective;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var _angular2 = _interopRequireDefault(_angular);

  var CellController = (function () {
    function CellController() {
      _classCallCheck(this, CellController);
    }

    _createClass(CellController, [{
      key: 'styles',

      /**
       * Calculates the styles for the Cell Directive
       * @param  {column}
       * @return {styles object}
       */
      value: function styles(col) {
        return {
          width: col.width + 'px'
        };
      }
    }, {
      key: 'cellClass',

      /**
       * Calculates the css classes for the cell directive
       * @param  {column}
       * @return {class object}
       */
      value: function cellClass(col) {
        var style = {
          'dt-tree-col': col.isTreeColumn
        };

        if (col.className) {
          style[col.className] = true;
        }

        return style;
      }
    }, {
      key: 'treeClass',

      /**
       * Calculates the tree class styles.
       * @param  {scope}
       * @return {css classes object}
       */
      value: function treeClass(scope) {
        return {
          'dt-tree-toggle': true,
          'icon-right': !scope.expanded,
          'icon-down': scope.expanded
        };
      }
    }, {
      key: 'onTreeToggle',

      /**
       * Invoked when the tree toggle button was clicked.
       * @param  {event}
       * @param  {scope}
       */
      value: function onTreeToggle(evt, scope) {
        evt.stopPropagation();
        scope.expanded = !scope.expanded;
        scope.onTreeToggle({
          cell: {
            value: scope.value,
            column: scope.column,
            expanded: scope.expanded
          }
        });
      }
    }, {
      key: 'onCheckboxChange',

      /**
       * Invoked when the checkbox was changed
       * @param  {object} scope 
       */
      value: function onCheckboxChange(scope) {
        scope.onCheckboxChange();
      }
    }, {
      key: 'getValue',

      /**
       * Returns the value in its fomatted form
       * @param  {object} scope 
       * @return {string} value
       */
      value: function getValue(scope) {
        var val = scope.column.cellDataGetter ? scope.column.cellDataGetter(scope.value) : scope.value;

        if (val === undefined || val === null) val = '';

        return val;
      }
    }]);

    return CellController;
  })();

  exports.CellController = CellController;
  ;

  function CellDirective($rootScope, $compile, $log) {
    return {
      restrict: 'E',
      controller: 'CellController',
      controllerAs: 'cell',
      scope: {
        value: '=',
        selected: '=',
        column: '=',
        expanded: '=',
        hasChildren: '=',
        onTreeToggle: '&',
        onCheckboxChange: '&'
      },
      template: '<div class="dt-cell" \n            data-title="{{::column.name}}" \n            ng-style="cell.styles(column)"\n            ng-class="cell.cellClass(column)">\n        <label ng-if="column.isCheckboxColumn" class="dt-checkbox">\n          <input type="checkbox" \n                 ng-checked="selected"\n                 ng-click="cell.onCheckboxChange(this)" />\n        </label>\n        <span ng-if="column.isTreeColumn && hasChildren"\n              ng-class="cell.treeClass(this)"\n              ng-click="cell.onTreeToggle($event, this)"></span>\n        <span class="dt-cell-content"></span>\n      </div>',
      replace: true,
      compile: function compile() {
        return {
          pre: function pre($scope, $elm, $attrs, ctrl) {
            var content = _angular2['default'].element($elm[0].querySelector('.dt-cell-content'));

            $scope.$watch('value', function () {
              content.empty();

              if ($scope.column.cellRenderer) {
                var elm = _angular2['default'].element($scope.column.cellRenderer($scope, content));
                content.append($compile(elm)($scope));
              } else {
                content[0].innerHTML = ctrl.getValue($scope);
              }
            });
          }
        };
      }
    };
  }

  ;
});
define('components/body/group-row', ['exports', 'angular'], function (exports, _angular) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  exports.GroupRowDirective = GroupRowDirective;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var _angular2 = _interopRequireDefault(_angular);

  var GroupRowController = (function () {
    function GroupRowController() {
      _classCallCheck(this, GroupRowController);
    }

    _createClass(GroupRowController, [{
      key: 'onGroupToggle',
      value: function onGroupToggle(evt, scope) {
        evt.stopPropagation();
        scope.onGroupToggle({
          group: scope.value
        });
      }
    }, {
      key: 'treeClass',
      value: function treeClass(scope) {
        return {
          'dt-tree-toggle': true,
          'icon-right': !scope.expanded,
          'icon-down': scope.expanded
        };
      }
    }]);

    return GroupRowController;
  })();

  exports.GroupRowController = GroupRowController;

  function GroupRowDirective() {
    return {
      restrict: 'E',
      controller: 'GroupRowController',
      controllerAs: 'group',
      scope: {
        value: '=',
        onGroupToggle: '&',
        expanded: '='
      },
      replace: true,
      template: '\n      <div class="dt-group-row">\n        <span ng-class="group.treeClass(this)"\n              ng-click="group.onGroupToggle($event, this)">\n        </span>\n        <span class="dt-group-row-label">\n          {{value.name}}\n        </span>\n      </div>'
    };
  }

  ;
});
define('components/body/row', ['exports', 'angular', 'utils/utils'], function (exports, _angular, _utilsUtils) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  exports.RowDirective = RowDirective;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var _angular2 = _interopRequireDefault(_angular);

  var RowController = (function () {
    function RowController() {
      _classCallCheck(this, RowController);
    }

    _createClass(RowController, [{
      key: 'getValue',

      /**
       * Returns the value for a given column
       * @param  {scope}
       * @param  {col}
       * @return {value}
       */
      value: function getValue(scope, col) {
        return (0, _utilsUtils.DeepValueGetter)(scope.value, col.prop);
      }
    }, {
      key: 'onTreeToggle',

      /**
       * Invoked when a cell triggers the tree toggle
       * @param  {scope}
       * @param  {cell}
       */
      value: function onTreeToggle(scope, cell) {
        scope.onTreeToggle({
          cell: cell,
          row: scope.value
        });
      }
    }, {
      key: 'stylesByGroup',

      /**
       * Calculates the styles for a pin group
       * @param  {scope}
       * @param  {group}
       * @return {styles object}
       */
      value: function stylesByGroup(scope, group) {
        var styles = {
          width: scope.columnWidths[group] + 'px'
        };

        if (group === 'left') {
          styles.transform = 'translate3d(' + scope.options.internal.offsetX + 'px, 0, 0)';
        } else if (group === 'right') {
          var offset = scope.columnWidths.total - scope.options.internal.innerWidth - scope.options.internal.offsetX;
          styles.transform = 'translate3d(-' + offset + 'px, 0, 0)';
        }

        return styles;
      }
    }, {
      key: 'onCheckboxChange',

      /**
       * Invoked when the cell directive's checkbox changed state
       * @param  {scope}
       */
      value: function onCheckboxChange(scope) {
        scope.onCheckboxChange({
          row: scope.value
        });
      }
    }]);

    return RowController;
  })();

  exports.RowController = RowController;

  function RowDirective() {
    return {
      restrict: 'E',
      controller: 'RowController',
      controllerAs: 'row',
      scope: {
        value: '=',
        columns: '=',
        columnWidths: '=',
        expanded: '=',
        selected: '=',
        hasChildren: '=',
        options: '=',
        onCheckboxChange: '&',
        onTreeToggle: '&'
      },
      template: '\n      <div class="dt-row">\n        <div class="dt-row-left dt-row-block" ng-style="row.stylesByGroup(this, \'left\')">\n          <dt-cell ng-repeat="column in columns[\'left\'] track by $index"\n                   on-tree-toggle="row.onTreeToggle(this, cell)"\n                   column="column"\n                   has-children="hasChildren"\n                   on-checkbox-change="row.onCheckboxChange(this)"\n                   selected="selected"\n                   expanded="expanded"\n                   value="row.getValue(this, column)">\n          </dt-cell>\n        </div>\n        <div class="dt-row-center dt-row-block" ng-style="row.stylesByGroup(this, \'center\')">\n          <dt-cell ng-repeat="column in columns[\'center\'] track by $index"\n                   on-tree-toggle="row.onTreeToggle(this, cell)"\n                   column="column"\n                   has-children="hasChildren"\n                   expanded="expanded"\n                   selected="selected"\n                   on-checkbox-change="row.onCheckboxChange(this)"\n                   value="row.getValue(this, column)">\n          </dt-cell>\n        </div>\n        <div class="dt-row-right dt-row-block" ng-style="row.stylesByGroup(this, \'right\')">\n          <dt-cell ng-repeat="column in columns[\'right\'] track by $index"\n                   on-tree-toggle="row.onTreeToggle(this, cell)"\n                   column="column"\n                   has-children="hasChildren"\n                   selected="selected"\n                   on-checkbox-change="row.onCheckboxChange(this)"\n                   expanded="expanded"\n                   value="row.getValue(this, column)">\n          </dt-cell>\n        </div>\n      </div>',
      replace: true
    };
  }

  ;
});
define('components/footer/footer', ['exports', 'angular'], function (exports, _angular) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  exports.FooterDirective = FooterDirective;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var _angular2 = _interopRequireDefault(_angular);

  var FooterController = (function () {

    /**
     * Creates an instance of the Footer Controller
     * @param  {scope}
     * @return {[type]}
     */
    /*@ngInject*/

    function FooterController($scope) {
      var _this = this;

      _classCallCheck(this, FooterController);

      $scope.page = $scope.paging.offset + 1;
      $scope.$watch('paging.offset', function (newVal) {
        _this.offsetChanged($scope, newVal);
      });
    }
    FooterController.$inject = ["$scope"];

    _createClass(FooterController, [{
      key: 'offsetChanged',

      /**
       * The offset ( page ) changed externally, update the page
       * @param  {new offset}
       */
      value: function offsetChanged(scope, newVal) {
        scope.page = newVal + 1;
      }
    }, {
      key: 'onPage',

      /**
       * The pager was invoked
       * @param  {scope}
       */
      value: function onPage(scope, page) {
        scope.paging.offset = page - 1;
        scope.onPage({
          offset: scope.paging.offset,
          size: scope.paging.size
        });
      }
    }]);

    return FooterController;
  })();

  exports.FooterController = FooterController;
  ;

  function FooterDirective() {
    return {
      restrict: 'E',
      controller: 'FooterController',
      controllerAs: 'footer',
      scope: {
        paging: '=',
        onPage: '&'
      },
      template: '<div class="dt-footer">\n        <div class="page-count">{{paging.count}} total</div>\n        <dt-pager page="page"\n               size="paging.size"\n               count="paging.count"\n               on-page="footer.onPage(this, page)"\n               ng-show="paging.count > 1">\n         </dt-pager>\n      </div>',
      replace: true
    };
  }

  ;
});
define('components/footer/pager', ['exports', 'angular'], function (exports, _angular) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  exports.PagerDirective = PagerDirective;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var _angular2 = _interopRequireDefault(_angular);

  var PagerController = (function () {

    /**
     * Creates an instance of the Pager Controller
     * @param  {object} $scope   
     */
    /*@ngInject*/

    function PagerController($scope) {
      var _this = this;

      _classCallCheck(this, PagerController);

      _angular2['default'].extend(this, {
        size: $scope.size,
        count: $scope.count
      });

      this.totalPages = this.calcTotalPages();
      $scope.$watch('page', function (newVal) {
        if (newVal !== 0 && newVal <= _this.totalPages) {
          _this.getPages(newVal);
        }
      });
    }
    PagerController.$inject = ["$scope"];

    _createClass(PagerController, [{
      key: 'calcTotalPages',

      /**
       * Calculates the total number of pages given the count.
       * @return {int} page count
       */
      value: function calcTotalPages() {
        var count = this.size < 1 ? 1 : Math.ceil(this.count / this.size);
        return Math.max(count || 0, 1);
      }
    }, {
      key: 'selectPage',

      /**
       * Select a page
       * @param  {object} scope 
       * @param  {int} num   
       */
      value: function selectPage(scope, num) {
        if (num > 0 && num <= this.totalPages) {
          scope.page = num;
          scope.onPage({
            page: num
          });
        }
      }
    }, {
      key: 'canPrevious',

      /**
       * Determines if the pager can go previous
       * @param  {scope} scope 
       * @return {boolean}
       */
      value: function canPrevious(scope) {
        return scope.page !== 1;
      }
    }, {
      key: 'canNext',

      /**
       * Determines if the pager can go forward
       * @param  {object} scope 
       * @return {boolean}       
       */
      value: function canNext(scope) {
        return scope.page <= this.totalPages;
      }
    }, {
      key: 'getPages',

      /**
       * Gets the page set given the current page
       * @param  {int} page 
       */
      value: function getPages(page) {
        var pages = [],
            startPage = 1,
            endPage = this.totalPages,
            maxSize = 5,
            isMaxSized = maxSize < this.totalPages;

        if (isMaxSized) {
          startPage = (Math.ceil(page / maxSize) - 1) * maxSize + 1;
          endPage = Math.min(startPage + maxSize - 1, this.totalPages);
        }

        for (var number = startPage; number <= endPage; number++) {
          pages.push({
            number: number,
            text: number,
            active: number === page
          });
        }

        if (isMaxSized) {
          if (startPage > 1) {
            pages.unshift({
              number: startPage - 1,
              text: '...'
            });
          }

          if (endPage < this.totalPages) {
            pages.push({
              number: endPage + 1,
              text: '...'
            });
          }
        }

        this.pages = pages;
      }
    }]);

    return PagerController;
  })();

  exports.PagerController = PagerController;
  ;

  function PagerDirective() {
    return {
      restrict: 'E',
      controller: 'PagerController',
      controllerAs: 'pager',
      scope: {
        page: '=',
        size: '=',
        count: '=',
        onPage: '&'
      },
      template: '<div class="dt-pager">\n        <ul class="pager">\n          <li ng-class="{ disabled: !pager.canPrevious(this) }">\n            <a href ng-click="pager.selectPage(this, 1)" class="icon-left"></a>\n          </li>\n          <li ng-repeat="pg in pager.pages track by $index" ng-class="{ active: pg.active }">\n            <a href ng-click="pager.selectPage(this, pg.number)">{{pg.text}}</a>\n          </li>\n          <li ng-class="{ disabled: !pager.canNext(this) }">\n            <a href ng-click="pager.selectPage(this, pager.totalPages)" class="icon-right"></a>\n          </li>\n        </ul>\n      </div>',
      replace: true
    };
  }

  ;
});
define('components/menu/context', ['exports', 'module', 'angular', './dropdown'], function (exports, module, _angular, _dropdown) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var _angular2 = _interopRequireDefault(_angular);

  var _Dropdown = _interopRequireDefault(_dropdown);

  var ContextMenuController = function ContextMenuController() {
    _classCallCheck(this, ContextMenuController);
  };

  function ContextMenuDirective() {
    return {
      restrict: 'C',
      controller: 'ContextMenuController',
      link: function link($scope, $elm, $attrs, ctrl) {}
    };
  }

  module.exports = _angular2['default'].module('contextmenu', [_Dropdown['default'].name]).directive('contextMenu', ContextMenuDirective);
});
define('components/menu/dropdown', ['exports', 'module', 'angular'], function (exports, module, _angular) {
  'use strict';

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var _angular2 = _interopRequireDefault(_angular);

  var DropdownController = (function () {
    /*@ngInject*/

    function DropdownController($scope) {
      _classCallCheck(this, DropdownController);

      $scope.open = false;
    }
    DropdownController.$inject = ["$scope"];

    _createClass(DropdownController, [{
      key: 'toggle',
      value: function toggle(scope) {
        scope.open = !scope.open;
      }
    }]);

    return DropdownController;
  })();

  function DropdownDirective($document, $timeout) {
    return {
      restrict: 'C',
      controller: 'DropdownController',
      link: function link($scope, $elm, $attrs) {

        function closeDropdown(ev) {
          if ($elm[0].contains(ev.target)) {
            return;
          }

          $timeout(function () {
            $scope.open = false;
            off();
          });
        };

        function keydown(ev) {
          if (ev.which === 27) {
            $timeout(function () {
              $scope.open = false;
              off();
            });
          }
        };

        function off() {
          $document.unbind('click', closeDropdown);
          $document.unbind('keydown', keydown);
        };

        $scope.$watch('open', function (newVal) {
          if (newVal) {
            $document.bind('click', closeDropdown);
            $document.bind('keydown', keydown);
          }
        });
      }
    };
  };

  function DropdownMenuDirective($animate) {
    return {
      restrict: 'C',
      require: '?^dropdown',
      link: function link($scope, $elm, $attrs, ctrl) {
        $scope.$watch('open', function () {
          $animate[$scope.open ? 'addClass' : 'removeClass']($elm, 'ddm-open');
        });
      }
    };
  };

  function DropdownToggleDirective($timeout) {
    return {
      restrict: 'C',
      controller: 'DropdownController',
      require: '?^dropdown',
      link: function link($scope, $elm, $attrs, ctrl) {

        function toggleClick(event) {
          event.preventDefault();
          $timeout(function () {
            ctrl.toggle($scope);
          });
        };

        function toggleDestroy() {
          $elm.unbind('click', toggleClick);
        };

        $elm.bind('click', toggleClick);
        $scope.$on('$destroy', toggleDestroy);
      }
    };
  };

  module.exports = _angular2['default'].module('dt.dropdown', []).controller('DropdownController', DropdownController).directive('dropdown', DropdownDirective).directive('dropdownToggle', DropdownToggleDirective).directive('dropdownMenu', DropdownMenuDirective);
});
define('components/menu/menu', ['exports', 'module', 'angular', './dropdown'], function (exports, module, _angular, _dropdown) {
  'use strict';

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var _angular2 = _interopRequireDefault(_angular);

  var _Dropdown = _interopRequireDefault(_dropdown);

  var DataTableMenuController = (function () {
    /*@ngInject*/

    function DataTableMenuController($scope, $timeout) {
      _classCallCheck(this, DataTableMenuController);

      this.$scope = $scope;
    }
    DataTableMenuController.$inject = ["$scope", "$timeout"];

    _createClass(DataTableMenuController, [{
      key: 'getColumnIndex',
      value: function getColumnIndex(model) {
        return this.$scope.current.findIndex(function (col) {
          return model.name == col.name;
        });
      }
    }, {
      key: 'isChecked',
      value: function isChecked(model) {
        return this.getColumnIndex(model) > -1;
      }
    }, {
      key: 'onCheck',
      value: function onCheck(model) {
        var idx = this.getColumnIndex(model);
        if (idx === -1) {
          this.$scope.current.push(model);
        } else {
          this.$scope.current.splice(idx, 1);
        }
      }
    }]);

    return DataTableMenuController;
  })();

  function DataTableMenuDirective() {
    return {
      restrict: 'E',
      controller: 'DataTableMenuController',
      controllerAs: 'dtm',
      scope: {
        current: '=',
        available: '='
      },
      template: '<div class="dt-menu dropdown" close-on-click="false">\n        <a href="#" class="dropdown-toggle icon-add">\n          Configure Columns\n        </a>\n        <div class="dropdown-menu" role="menu" aria-labelledby="dropdown">\n          <div class="keywords">\n            <input type="text" \n                   click-select\n                   placeholder="Filter columns..." \n                   ng-model="columnKeyword" \n                   autofocus />\n          </div>\n          <ul>\n            <li ng-repeat="column in available | filter:columnKeyword">\n              <label class="dt-checkbox">\n                <input type="checkbox" \n                       ng-checked="dtm.isChecked(column)"\n                       ng-click="dtm.onCheck(column)">\n                {{column.name}}\n              </label>\n            </li>\n          </ul>\n        </div>\n      </div>'
    };
  };

  module.exports = _angular2['default'].module('dt.menu', [_Dropdown['default'].name]).controller('DataTableMenuController', DataTableMenuController).directive('dtm', DataTableMenuDirective);
});
define('components/header/header-cell', ['exports', 'angular', 'utils/resizable'], function (exports, _angular, _utilsResizable) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  exports.HeaderCellDirective = HeaderCellDirective;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var _angular2 = _interopRequireDefault(_angular);

  var HeaderCellController = (function () {
    function HeaderCellController() {
      _classCallCheck(this, HeaderCellController);
    }

    _createClass(HeaderCellController, [{
      key: 'styles',

      /**
       * Calculates the styles for the header cell directive
       * @param  {scope}
       * @return {styles}
       */
      value: function styles(scope) {
        return {
          width: scope.column.width + 'px',
          minWidth: scope.column.minWidth + 'px',
          maxWidth: scope.column.maxWidth + 'px',
          height: scope.column.height + 'px'
        };
      }
    }, {
      key: 'cellClass',

      /**
       * Calculates the css classes for the header cell directive
       * @param  {scope}
       */
      value: function cellClass(scope) {
        var cls = {
          'sortable': scope.column.sortable,
          'dt-header-cell': true,
          'resizable': scope.column.resizable
        };

        if (scope.column.heaerClassName) {
          cls[scope.column.heaerClassName] = true;
        }

        return cls;
      }
    }, {
      key: 'sort',

      /**
       * Toggles the sorting on the column
       * @param  {scope}
       */
      value: function sort(scope) {
        if (scope.column.sortable) {
          if (!scope.column.sort) {
            scope.column.sort = 'asc';
          } else if (scope.column.sort === 'asc') {
            scope.column.sort = 'desc';
          } else if (scope.column.sort === 'desc') {
            scope.column.sort = undefined;
          }

          scope.onSort({
            column: scope.column
          });
        }
      }
    }, {
      key: 'sortClass',

      /**
       * Toggles the css class for the sort button
       * @param  {scope}
       */
      value: function sortClass(scope) {
        return {
          'sort-btn': true,
          'sort-asc icon-down': scope.column.sort === 'asc',
          'sort-desc icon-up': scope.column.sort === 'desc'
        };
      }
    }, {
      key: 'onResize',

      /**
       * Updates the column width on resize
       * @param  {width}
       * @param  {column}
       */
      value: function onResize(scope, width, column) {
        scope.onResize({
          column: column,
          width: width
        });
        //column.width = width;
      }
    }, {
      key: 'onCheckboxChange',

      /**
       * Invoked when the header cell directive checkbox was changed
       * @param  {object} scope angularjs scope
       */
      value: function onCheckboxChange(scope) {
        scope.onCheckboxChange();
      }
    }]);

    return HeaderCellController;
  })();

  exports.HeaderCellController = HeaderCellController;

  function HeaderCellDirective($compile) {
    return {
      restrict: 'E',
      controller: 'HeaderCellController',
      controllerAs: 'hcell',
      scope: {
        column: '=',
        onCheckboxChange: '&',
        onSort: '&',
        onResize: '&',
        selected: '='
      },
      replace: true,
      template: '<div ng-class="hcell.cellClass(this)"\n            ng-style="hcell.styles(this)"\n            title="{{::column.name}}">\n        <div resizable="column.resizable" \n             on-resize="hcell.onResize(this, width, column)"\n             min-width="column.minWidth"\n             max-width="column.maxWidth">\n          <label ng-if="column.isCheckboxColumn && column.headerCheckbox" class="dt-checkbox">\n            <input type="checkbox" \n                   ng-checked="selected"\n                   ng-click="hcell.onCheckboxChange(this)" />\n          </label>\n          <span class="dt-header-cell-label" \n                ng-click="hcell.sort(this)">\n          </span>\n          <span ng-class="hcell.sortClass(this)"></span>\n        </div>\n      </div>',
      compile: function compile() {
        return {
          pre: function pre($scope, $elm, $attrs, ctrl) {
            var label = $elm[0].querySelector('.dt-header-cell-label');

            if ($scope.column.headerRenderer) {
              var elm = _angular2['default'].element($scope.column.headerRenderer($scope, $elm));
              _angular2['default'].element(label).append($compile(elm)($scope)[0]);
            } else {
              var val = $scope.column.name;
              if (val === undefined || val === null) val = '';
              label.innerHTML = val;
            }
          }
        };
      }
    };
  }

  ;
});
define('components/header/header', ['exports', 'angular', 'utils/sortable'], function (exports, _angular, _utilsSortable) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  exports.HeaderDirective = HeaderDirective;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var _angular2 = _interopRequireDefault(_angular);

  var HeaderController = (function () {
    function HeaderController() {
      _classCallCheck(this, HeaderController);
    }

    _createClass(HeaderController, [{
      key: 'styles',

      /**
       * Returns the styles for the header directive.
       * @param  {object} scope
       * @return {object} styles
       */
      value: function styles(scope) {
        return {
          width: scope.options.internal.innerWidth + 'px',
          height: scope.options.headerHeight + 'px'
        };
      }
    }, {
      key: 'innerStyles',

      /**
       * Returns the inner styles for the header directive
       * @param  {object} scope
       * @return {object} styles
       */
      value: function innerStyles(scope) {
        return {
          width: scope.columnWidths.total + 'px'
        };
      }
    }, {
      key: 'onSort',

      /**
       * Invoked when a column sort direction has changed
       * @param  {object} scope
       * @param  {object} column
       */
      value: function onSort(scope, column) {
        scope.onSort({
          column: column
        });
      }
    }, {
      key: 'stylesByGroup',

      /**
       * Returns the styles by group for the headers.
       * @param  {scope}
       * @param  {group}
       * @return {styles object}
       */
      value: function stylesByGroup(scope, group) {
        var styles = {
          width: scope.columnWidths[group] + 'px'
        };

        if (group === 'center') {
          styles['transform'] = 'translate3d(-' + scope.options.internal.offsetX + 'px, 0, 0)';
        } else if (group === 'right') {
          var offset = scope.columnWidths.total - scope.options.internal.innerWidth;
          styles.transform = 'translate3d(-' + offset + 'px, 0, 0)';
        }

        return styles;
      }
    }, {
      key: 'onCheckboxChange',

      /**
       * Invoked when the header cell directive's checkbox has changed.
       * @param  {scope}
       */
      value: function onCheckboxChange(scope) {
        scope.onCheckboxChange();
      }
    }, {
      key: 'onResize',

      /**
       * Occurs when a header cell directive triggered a resize
       * @param  {object} scope  
       * @param  {object} column 
       * @param  {int} width  
       */
      value: function onResize(scope, column, width) {
        scope.onResize({
          column: column,
          width: width
        });
      }
    }]);

    return HeaderController;
  })();

  exports.HeaderController = HeaderController;
  ;

  function HeaderDirective($timeout) {

    return {
      restrict: 'E',
      controller: 'HeaderController',
      controllerAs: 'header',
      scope: {
        options: '=',
        columns: '=',
        columnWidths: '=',
        onSort: '&',
        onResize: '&',
        onCheckboxChange: '&'
      },
      template: '\n      <div class="dt-header" ng-style="header.styles(this)">\n        <div class="dt-header-inner" ng-style="header.innerStyles(this)">\n          <div class="dt-row-left"\n               ng-style="header.stylesByGroup(this, \'left\')"\n               sortable="options.reorderable"\n               on-sortable-sort="columnsResorted(event, childScope)">\n            <dt-header-cell ng-repeat="column in columns[\'left\'] track by column.name" \n                            on-checkbox-change="header.onCheckboxChange(this)"\n                            on-sort="header.onSort(this, column)"\n                            on-resize="header.onResize(this, column, width)"\n                            selected="header.isSelected(this)"\n                            column="column">\n            </dt-header-cell>\n          </div>\n          <div class="dt-row-center" \n               sortable="options.reorderable"\n               ng-style="header.stylesByGroup(this, \'center\')"\n               on-sortable-sort="columnsResorted(event, childScope)">\n            <dt-header-cell ng-repeat="column in columns[\'center\'] track by column.name" \n                            on-checkbox-change="header.onCheckboxChange(this)"\n                            on-sort="header.onSort(this, column)"\n                            selected="header.isSelected(this)"\n                            on-resize="header.onResize(this, column, width)"\n                            column="column">\n            </dt-header-cell>\n          </div>\n          <div class="dt-row-right"\n               sortable="options.reorderable"\n               ng-style="header.stylesByGroup(this, \'right\')"\n               on-sortable-sort="columnsResorted(event, childScope)">\n            <dt-header-cell ng-repeat="column in columns[\'right\'] track by column.name" \n                            on-checkbox-change="header.onCheckboxChange(this)"\n                            on-sort="header.onSort(this, column)"\n                            selected="header.isSelected(this)"\n                            on-resize="header.onResize(this, column, width)"\n                            column="column">\n            </dt-header-cell>\n          </div>\n        </div>\n      </div>',
      replace: true,
      link: function link($scope, $elm, $attrs, ctrl) {

        $scope.columnsResorted = function (event, childScope) {
          var col = childScope.column,
              parent = _angular2['default'].element(event.currentTarget),
              newIdx = -1;

          _angular2['default'].forEach(parent.children(), function (c, i) {
            if (childScope === _angular2['default'].element(c).scope()) {
              newIdx = i;
            }
          });

          $timeout(function () {
            _angular2['default'].forEach($scope.columns, function (group) {
              var idx = group.indexOf(col);
              if (idx > -1) {
                group.splice(idx, 1);
                group.splice(newIdx, 0, col);
              }
            });
          });
        };
      }
    };
  }

  ;
});
define('components/popover/directive', ['exports', 'angular'], function (exports, _angular) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  exports.PopoverDirective = PopoverDirective;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _angular2 = _interopRequireDefault(_angular);

  /**
   * Popover Directive
   * @param {object} $q              
   * @param {function} $timeout        
   * @param {function} $templateCache  
   * @param {function} $compile        
   * @param {function} PopoverRegistry 
   * @param {function} $animate        
   */

  function PopoverDirective($q, $timeout, $templateCache, $compile, PopoverRegistry, PositionHelper, $animate) {

    /**
     * Loads a template from the template cache
     * @param  {string} template 
     * @param  {boolean} plain    
     * @return {object}  html template
     */
    function loadTemplate(template, plain) {
      if (!template) {
        return '';
      }

      if (_angular2['default'].isString(template) && plain) {
        return template;
      }

      return $templateCache.get(template) || $http.get(template, { cache: true });
    }

    /**
     * Determines a boolean given a value
     * @param  {object} value 
     * @return {boolean}       
     */
    function toBoolean(value) {
      if (value && value.length !== 0) {
        var v = ('' + value).toLowerCase();
        value = v == 'true';
      } else {
        value = false;
      }
      return value;
    }

    return {
      restrict: 'A',
      scope: true,
      replace: false,
      link: function link($scope, $element, $attributes) {
        $scope.popover = null;
        $scope.popoverId = Date.now();

        $scope.options = {
          text: $attributes.swPopoverText,
          template: $attributes.swPopoverTemplate,
          plain: toBoolean($attributes.swPopoverPlain || false),
          placement: $attributes.swPopoverPlacement || 'right',
          alignment: $attributes.swPopoverAlignment || 'center',
          group: $attributes.swPopoverGroup,
          spacing: parseInt($attributes.swPopoverSpacing) || 0,
          showCaret: toBoolean($attributes.swPopoverPlain || false)
        };

        // attach exit and enter events to element
        $element.off('mouseenter', display);
        $element.on('mouseenter', display);
        $element.off('mouseleave', mouseOut);
        $element.on('mouseleave', mouseOut);

        function mouseOut() {
          $scope.exitTimeout = $timeout(remove, 500);
        };

        /**
         * Displays the popover on the page
         */
        function display() {
          // Cancel exit timeout
          $timeout.cancel($scope.exitTimeout);

          var elm = document.getElementById('#sw-' + $scope.popoverId);
          if ($scope.popover && elm) return;

          // remove other popovers from the same group
          if ($scope.options.group) {
            PopoverRegistry.removeGroup($scope.options.group, $scope.popoverId);
          }

          if ($scope.options.text && !$scope.options.template) {
            $scope.popover = _angular2['default'].element('<div class="sw-popover sw-popover-text \n            sw-popover' + $scope.options.placement + '" id="sw-' + $scope.popoverId + '"></div>');

            $scope.popover.html($scope.options.text);
            _angular2['default'].element(document.body).append($scope.popover);
            positionPopover($element, $scope.popover, $scope.options);
            PopoverRegistry.add($scope.popoverId, { element: $element, popover: $scope.popover, group: $scope.options.group });
          } else {
            $q.when(loadTemplate($scope.options.template, $scope.options.plain)).then(function (template) {
              if (!_angular2['default'].isString(template)) {
                if (template.data && _angular2['default'].isString(template.data)) {
                  template = template.data;
                } else {
                  template = '';
                }
              }

              $scope.popover = _angular2['default'].element('<div class="sw-popover \n              sw-popover-' + $scope.options.placement + '" id="sw-' + $scope.popoverId + '"></div>');

              $scope.popover.html(template);
              $compile($scope.popover)($scope);
              _angular2['default'].element(document.body).append($scope.popover);
              positionPopover($element, $scope.popover, $scope.options);

              // attach exit and enter events to popover
              $scope.popover.off('mouseleave', mouseOut);
              $scope.popover.on('mouseleave', mouseOut);
              $scope.popover.on('mouseenter', function () {
                $timeout.cancel($scope.exitTimeout);
              });

              PopoverRegistry.add($scope.popoverId, {
                element: $element,
                popover: $scope.popover,
                group: $scope.options.group
              });
            });
          }
        };

        /**
         * Removes the template from the registry and page
         */
        function remove() {
          if ($scope.popover) {
            $scope.popover.remove();
          }

          $scope.popover = undefined;
          PopoverRegistry.remove($scope.popoverId);
        };

        /**
         * Positions the popover
         * @param  {object} triggerElement 
         * @param  {object} popover        
         * @param  {object} options        
         */
        function positionPopover(triggerElement, popover, options) {
          $timeout(function () {
            var elDimensions = triggerElement[0].getBoundingClientRect(),
                popoverDimensions = popover[0].getBoundingClientRect(),
                top,
                left;

            if (options.placement === 'right') {
              left = elDimensions.left + elDimensions.width + options.spacing;
              top = PositionHelper.calculateVerticalAlignment(elDimensions, popoverDimensions, options.alignment);
            }
            if (options.placement === 'left') {
              left = elDimensions.left - popoverDimensions.width - options.spacing;
              top = PositionHelper.calculateVerticalAlignment(elDimensions, popoverDimensions, options.alignment);
            }
            if (options.placement === 'top') {
              top = elDimensions.top - popoverDimensions.height - options.spacing;
              left = PositionHelper.calculateHorizontalAlignment(elDimensions, popoverDimensions, options.alignment);
            }
            if (options.placement === 'bottom') {
              top = elDimensions.top + elDimensions.height + options.spacing;
              left = PositionHelper.calculateHorizontalAlignment(elDimensions, popoverDimensions, options.alignment);
            }

            popover.css({
              top: top + 'px',
              left: left + 'px'
            });

            if ($scope.options.showCaret) {
              addCaret($scope.popover, elDimensions, popoverDimensions);
            }

            $animate.addClass($scope.popover, 'sw-popover-animation');
          }, 50);
        };

        /**
         * Adds a caret and positions it relatively to the popover
         * @param {object} popoverEl         
         * @param {object} elDimensions      
         * @param {object} popoverDimensions 
         */
        function addCaret(popoverEl, elDimensions, popoverDimensions) {
          var caret = _angular2['default'].element('<span class="popover-caret caret-' + $scope.options.placement + '"></span>');
          popoverEl.append(caret);
          var caretDimensions = caret[0].getBoundingClientRect();

          var left, top;
          if ($scope.options.placement === 'right') {
            left = -6;
            top = PositionHelper.calculateVerticalCaret(elDimensions, popoverDimensions, caretDimensions, $scope.options.alignment);
          }
          if ($scope.options.placement === 'left') {
            left = popoverDimensions.width - 2;
            top = PositionHelper.calculateVerticalCaret(elDimensions, popoverDimensions, caretDimensions, $scope.options.alignment);
          }
          if ($scope.options.placement === 'top') {
            top = popoverDimensions.height - 5;
            left = PositionHelper.calculateHorizontalCaret(elDimensions, popoverDimensions, caretDimensions, $scope.options.alignment);
          }

          if ($scope.options.placement === 'bottom') {
            top = -8;
            left = PositionHelper.calculateHorizontalCaret(elDimensions, popoverDimensions, caretDimensions, $scope.options.alignment);
          }

          caret.css({
            top: top + 'px',
            left: left + 'px'
          });
        };
      }
    };
  }

  ;
});
define('components/popover/popover', ['exports', 'module', 'angular', './directive', './registry', './position'], function (exports, module, _angular, _directive, _registry, _position) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _angular2 = _interopRequireDefault(_angular);

  module.exports = _angular2['default'].module('popover', []).service('PopoverRegistry', _registry.PopoverRegistry).factory('PositionHelper', _position.PositionHelper).directive('swPopover', _directive.PopoverDirective);
});
define('components/popover/position', ['exports'], function (exports) {
  /**
   * Position helper for the popover directive.
   */
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  exports.PositionHelper = PositionHelper;

  function PositionHelper() {
    return {

      calculateVerticalAlignment: function calculateVerticalAlignment(elDimensions, popoverDimensions, alignment) {
        if (alignment === 'top') {
          return elDimensions.top;
        }
        if (alignment === 'bottom') {
          return elDimensions.top + elDimensions.height - popoverDimensions.height;
        }
        if (alignment === 'center') {
          return elDimensions.top + elDimensions.height / 2 - popoverDimensions.height / 2;
        }
      },

      calculateVerticalCaret: function calculateVerticalCaret(elDimensions, popoverDimensions, caretDimensions, alignment) {
        if (alignment === 'top') {
          return elDimensions.height / 2 - caretDimensions.height / 2 - 1;
        }
        if (alignment === 'bottom') {
          return popoverDimensions.height - elDimensions.height / 2 - caretDimensions.height / 2 - 1;
        }
        if (alignment === 'center') {
          return popoverDimensions.height / 2 - caretDimensions.height / 2 - 1;
        }
      },

      calculateHorizontalCaret: function calculateHorizontalCaret(elDimensions, popoverDimensions, caretDimensions, alignment) {
        if (alignment === 'left') {
          return elDimensions.width / 2 - caretDimensions.height / 2 - 1;
        }
        if (alignment === 'right') {
          return popoverDimensions.width - elDimensions.width / 2 - caretDimensions.height / 2 - 1;
        }
        if (alignment === 'center') {
          return popoverDimensions.width / 2 - caretDimensions.height / 2 - 1;
        }
      },

      calculateHorizontalAlignment: function calculateHorizontalAlignment(elDimensions, popoverDimensions, alignment) {
        if (alignment === 'left') {
          return elDimensions.left;
        }
        if (alignment === 'right') {
          return elDimensions.left + elDimensions.width - popoverDimensions.width;
        }
        if (alignment === 'center') {
          return elDimensions.left + elDimensions.width / 2 - popoverDimensions.width / 2;
        }
      }

    };
  }

  ;
});
define('components/popover/registry', ['exports'], function (exports) {
  /**
   * Registering to deal with popovers
   * @param {function} $animate
   */
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  exports.PopoverRegistry = PopoverRegistry;

  function PopoverRegistry($animate) {
    var popovers = {};
    this.add = function (id, object) {
      popovers[id] = object;
    };
    this.find = function (id) {
      popovers[id];
    };
    this.remove = function (id) {
      delete popovers[id];
    };
    this.removeGroup = function (group, currentId) {
      angular.forEach(popovers, function (popoverOb, id) {
        if (id === currentId) return;

        if (popoverOb.group && popoverOb.group === group) {
          $animate.removeClass(popoverOb.popover, 'sw-popover-animate').then(function () {
            popoverOb.popover.remove();
            delete popovers[id];
          });
        }
      });
    };
  }

  ;
});