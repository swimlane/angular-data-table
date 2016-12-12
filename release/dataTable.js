/**
 * angular-data-table - A feature-rich but lightweight ES6 AngularJS Data Table crafted for large data sets!
 * @version v0.7.2
 * @link http://swimlane.com/
 * @license MIT
 */
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define("DataTable", ["exports", "angular"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("angular"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.angular);
    global.DataTable = mod.exports;
  }
})(this, function (exports, _angular) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.dtMenu = exports.dtPopover = undefined;

  var _angular2 = _interopRequireDefault(_angular);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    } else {
      return Array.from(arr);
    }
  }

  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  /**
   * Array.prototype.find()
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
   */
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

  /**
   * Resizable directive
   * http://stackoverflow.com/questions/18368485/angular-js-resizable-div-directive
   * @param {object}
   * @param {function}
   * @param {function}
   */
  function ResizableDirective($document, $timeout) {
    return {
      restrict: 'A',
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

        var handle = angular.element("<span class=\"dt-resize-handle\" title=\"Resize\"></span>"),
            parent = $element.parent(),
            prevScreenX;

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
          event = event.originalEvent || event;

          var width = parent[0].clientWidth,
              movementX = event.movementX || event.mozMovementX || event.screenX - prevScreenX,
              newWidth = width + (movementX || 0);

          prevScreenX = event.screenX;

          if ((!$scope.minWidth || newWidth >= $scope.minWidth) && (!$scope.maxWidth || newWidth <= $scope.maxWidth)) {
            parent.css({
              width: newWidth + 'px'
            });
          }
        }

        function mouseup() {
          if ($scope.onResize) {
            $timeout(function () {
              var width = parent[0].clientWidth;
              if (width < $scope.minWidth) {
                width = $scope.minWidth;
              }
              $scope.onResize({ width: width });
            });
          }

          $document.unbind('mousemove', mousemove);
          $document.unbind('mouseup', mouseup);
        }

        $element.append(handle);
      }
    };
  }

  /**
   * Sortable Directive
   * http://jsfiddle.net/RubaXa/zLq5J/3/
   * https://jsfiddle.net/hrohxze0/6/
   * @param {function}
   */
  function SortableDirective($timeout) {
    return {
      restrict: 'A',
      scope: {
        isSortable: '=sortable',
        onSortableSort: '&'
      },
      link: function link($scope, $element, $attrs) {
        var rootEl = $element[0],
            dragEl,
            nextEl,
            dropEl;

        function isbefore(a, b) {
          if (a.parentNode == b.parentNode) {
            for (var cur = a; cur; cur = cur.previousSibling) {
              if (cur === b) {
                return true;
              }
            }
          }
          return false;
        }

        function onDragEnter(e) {
          var target = e.target;
          if (isbefore(dragEl, target)) {
            target.parentNode.insertBefore(dragEl, target);
          } else if (target.nextSibling && target.hasAttribute('draggable')) {
            target.parentNode.insertBefore(dragEl, target.nextSibling.nextSibling);
          }
        }

        function onDragEnd(evt) {
          evt.preventDefault();

          dragEl.classList.remove('dt-clone');

          $element.off('dragend', onDragEnd);
          $element.off('dragenter', onDragEnter);

          if (nextEl !== dragEl.nextSibling) {
            $scope.onSortableSort({
              event: evt,
              columnId: _angular2.default.element(dragEl).attr('data-id')
            });
          }
        }

        function onDragStart(evt) {
          if (!$scope.isSortable) return false;
          evt = evt.originalEvent || evt;

          dragEl = evt.target;
          nextEl = dragEl.nextSibling;
          dragEl.classList.add('dt-clone');

          evt.dataTransfer.effectAllowed = 'move';
          evt.dataTransfer.setData('Text', dragEl.textContent);

          $element.on('dragenter', onDragEnter);
          $element.on('dragend', onDragEnd);
        }

        $element.on('dragstart', onDragStart);

        $scope.$on('$destroy', function () {
          $element.off('dragstart', onDragStart);
        });
      }
    };
  }

  /**
   * Default Table Options
   * @type {object}
   */
  var TableDefaults = {

    // Enable vertical scrollbars
    scrollbarV: true,

    // Enable horz scrollbars
    // scrollbarH: true,

    // The row height, which is necessary
    // to calculate the height for the lazy rendering.
    rowHeight: 30,

    // flex
    // force
    // standard
    columnMode: 'standard',

    // Loading message presented when the array is undefined
    loadingMessage: 'Loading...',

    // Message to show when array is presented
    // but contains no values
    emptyMessage: 'No data to display',

    // The minimum header height in pixels.
    // pass falsey for no header
    headerHeight: 30,

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
      offset: 0,

      // Loading indicator
      loadingIndicator: false
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

  };

  /**
   * Default Column Options
   * @type {object}
   */
  var ColumnDefaults = {

    // pinned to the left
    frozenLeft: false,

    // pinned to the right
    frozenRight: false,

    // body cell css class name
    className: undefined,

    // header cell css class name
    headerClassName: undefined,

    // The grow factor relative to other columns. Same as the flex-grow
    // API from http://www.w3.org/TR/css3-flexbox/. Basically,
    // take any available extra width and distribute it proportionally
    // according to all columns' flexGrow values.
    flexGrow: 0,

    // Minimum width of the column.
    minWidth: 100,

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

    // If you want to sort a column by a special property
    // See an example in demos/sort.html
    sortBy: undefined,

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
    headerCheckbox: false,

    // Whether the column can automatically resize to fill space in the table.
    canAutoResize: true

  };

  /**
   * Shim layer with setTimeout fallback
   * http://www.html5rocks.com/en/tutorials/speed/animations/
   */
  var requestAnimFrame = function () {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
      window.setTimeout(callback, 1000 / 60);
    };
  }();

  /**
   * Creates a unique object id.
   */
  function ObjectId() {
    var timestamp = (new Date().getTime() / 1000 | 0).toString(16);
    return timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, function () {
      return (Math.random() * 16 | 0).toString(16);
    }).toLowerCase();
  }

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

  /**
   * Returns the widths of all group sets of a column
   * @param {object} groups 
   * @param {array} all 
   */
  function ColumnGroupWidths(groups, all) {
    return {
      left: ColumnTotalWidth(groups.left),
      center: ColumnTotalWidth(groups.center),
      right: ColumnTotalWidth(groups.right),
      total: ColumnTotalWidth(all)
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

  /**
   * Converts strings from something to camel case
   * http://stackoverflow.com/questions/10425287/convert-dash-separated-string-to-camelcase
   * @param  {string} str 
   * @return {string} camel case string
   */
  function CamelCase(str) {
    // Replace special characters with a space
    str = str.replace(/[^a-zA-Z0-9 ]/g, " ");
    // put a space before an uppercase letter
    str = str.replace(/([a-z](?=[A-Z]))/g, '$1 ');
    // Lower case first character and some other stuff
    str = str.replace(/([^a-zA-Z0-9 ])|^[0-9]+/g, '').trim().toLowerCase();
    // uppercase characters preceded by a space or number
    str = str.replace(/([ 0-9]+)([a-zA-Z])/g, function (a, b, c) {
      return b.trim() + c.toUpperCase();
    });
    return str;
  }

  /**
   * Gets the width of the scrollbar.  Nesc for windows
   * http://stackoverflow.com/a/13382873/888165
   * @return {int} width
   */
  function ScrollbarWidth() {
    var outer = document.createElement("div");
    outer.style.visibility = "hidden";
    outer.style.width = "100px";
    outer.style.msOverflowStyle = "scrollbar";
    document.body.appendChild(outer);

    var widthNoScroll = outer.offsetWidth;
    outer.style.overflow = "scroll";

    var inner = document.createElement("div");
    inner.style.width = "100%";
    outer.appendChild(inner);

    var widthWithScroll = inner.offsetWidth;
    outer.parentNode.removeChild(outer);

    return widthNoScroll - widthWithScroll;
  }

  function NextSortDirection(sortType, currentSort) {
    if (sortType === 'single') {
      if (currentSort === 'asc') {
        return 'desc';
      } else {
        return 'asc';
      }
    } else {
      if (!currentSort) {
        return 'asc';
      } else if (currentSort === 'asc') {
        return 'desc';
      } else if (currentSort === 'desc') {
        return undefined;
      }
    }
  }

  /**
   * Calculates the total width of all columns and their groups
   * @param {array} columns
   * @param {string} property width to get
   */
  function ColumnTotalWidth(columns, prop) {
    var totalWidth = 0;

    columns.forEach(function (c) {
      var has = prop && c[prop];
      totalWidth = totalWidth + (has ? c[prop] : c.width);
    });

    return totalWidth;
  }

  /**
   * Calculates the Total Flex Grow
   * @param {array}
   */
  function GetTotalFlexGrow(columns) {
    var totalFlexGrow = 0;

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = columns[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var c = _step.value;

        totalFlexGrow += c.flexGrow || 0;
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return totalFlexGrow;
  }

  /**
   * Adjusts the column widths.
   * Inspired by: https://github.com/facebook/fixed-data-table/blob/master/src/FixedDataTableWidthHelper.js
   * @param {array} all columns
   * @param {int} width
   */
  function AdjustColumnWidths(allColumns, expectedWidth) {
    var columnsWidth = ColumnTotalWidth(allColumns),
        totalFlexGrow = GetTotalFlexGrow(allColumns),
        colsByGroup = ColumnsByPin(allColumns);

    if (columnsWidth !== expectedWidth) {
      ScaleColumns(colsByGroup, expectedWidth, totalFlexGrow);
    }
  }

  /**
   * Resizes columns based on the flexGrow property, while respecting manually set widths
   * @param {array} colsByGroup
   * @param {int} maxWidth
   * @param {int} totalFlexGrow
   */
  function ScaleColumns(colsByGroup, maxWidth, totalFlexGrow) {
    // calculate total width and flexgrow points for coulumns that can be resized
    _angular2.default.forEach(colsByGroup, function (cols) {
      cols.forEach(function (column) {
        if (!column.canAutoResize) {
          maxWidth -= column.width;
          totalFlexGrow -= column.flexGrow;
        } else {
          column.width = 0;
        }
      });
    });

    var hasMinWidth = {};
    var remainingWidth = maxWidth;

    // resize columns until no width is left to be distributed

    var _loop = function _loop() {
      var widthPerFlexPoint = remainingWidth / totalFlexGrow;
      remainingWidth = 0;
      _angular2.default.forEach(colsByGroup, function (cols) {
        cols.forEach(function (column, i) {
          // if the column can be resize and it hasn't reached its minimum width yet
          if (column.canAutoResize && !hasMinWidth[i]) {
            var newWidth = column.width + column.flexGrow * widthPerFlexPoint;
            if (column.minWidth !== undefined && newWidth < column.minWidth) {
              remainingWidth += newWidth - column.minWidth;
              column.width = column.minWidth;
              hasMinWidth[i] = true;
            } else {
              column.width = newWidth;
            }
          }
        });
      });
    };

    do {
      _loop();
    } while (remainingWidth !== 0);
  }

  /**
   * Forces the width of the columns to
   * distribute equally but overflowing when nesc.
   *
   * Rules:
   *
   *  - If combined withs are less than the total width of the grid,
   *    proporation the widths given the min / max / noraml widths to fill the width.
   *
   *  - If the combined widths, exceed the total width of the grid,
   *    use the standard widths.
   *
   *  - If a column is resized, it should always use that width
   *
   *  - The proporational widths should never fall below min size if specified.
   *
   *  - If the grid starts off small but then becomes greater than the size ( + / - )
   *    the width should use the orginial width; not the newly proporatied widths.
   *
   * @param {array} allColumns
   * @param {int} expectedWidth
   */
  function ForceFillColumnWidths(allColumns, expectedWidth, startIdx) {
    var contentWidth = 0,
        columnsToResize = startIdx > -1 ? allColumns.slice(startIdx, allColumns.length).filter(function (c) {
      return c.canAutoResize;
    }) : allColumns.filter(function (c) {
      return c.canAutoResize;
    });

    allColumns.forEach(function (c) {
      if (!c.canAutoResize) {
        contentWidth += c.width;
      } else {
        contentWidth += c.$$oldWidth || c.width;
      }
    });

    var remainingWidth = expectedWidth - contentWidth,
        additionWidthPerColumn = remainingWidth / columnsToResize.length,
        exceedsWindow = contentWidth > expectedWidth;

    columnsToResize.forEach(function (column) {
      if (exceedsWindow) {
        column.width = column.$$oldWidth || column.width;
      } else {
        if (!column.$$oldWidth) {
          column.$$oldWidth = column.width;
        }

        var newSize = column.$$oldWidth + additionWidthPerColumn;
        if (column.minWith && newSize < column.minWidth) {
          column.width = column.minWidth;
        } else if (column.maxWidth && newSize > column.maxWidth) {
          column.width = column.maxWidth;
        } else {
          column.width = newSize;
        }
      }
    });
  }

  var DataTableController = function () {
    /**
     * Creates an instance of the DataTable Controller
     * @param  {scope}
     * @param  {filter}
     */
    /*@ngInject*/
    DataTableController.$inject = ["$scope", "$filter", "$log", "$transclude"];
    function DataTableController($scope, $filter, $log, $transclude) {
      var _this = this;

      _classCallCheck(this, DataTableController);

      _extends(this, {
        $scope: $scope,
        $filter: $filter,
        $log: $log
      });

      this.defaults();

      // set scope to the parent
      this.options.$outer = $scope.$parent;

      $scope.$watch('dt.options.columns', function (newVal, oldVal) {
        _this.transposeColumnDefaults();

        if (newVal.length !== oldVal.length) {
          _this.adjustColumns();
        }

        _this.calculateColumns();
      }, true);

      // default sort
      var watch = $scope.$watch('dt.rows', function (newVal) {
        if (newVal) {
          watch();
          _this.onSorted();
        }
      });
    }

    /**
     * Creates and extends default options for the grid control
     */


    _createClass(DataTableController, [{
      key: "defaults",
      value: function defaults() {
        var _this2 = this;

        this.expanded = this.expanded || {};

        this.options = _angular2.default.extend(_angular2.default.copy(TableDefaults), this.options);

        _angular2.default.forEach(TableDefaults.paging, function (v, k) {
          if (!_this2.options.paging[k]) {
            _this2.options.paging[k] = v;
          }
        });

        if (this.options.selectable && this.options.multiSelect) {
          this.selected = this.selected || [];

          this.$scope.$watch('dt.selected', function (newVal, oldVal) {
            _angular2.default.forEach(_this2.options.columns, function (column) {
              if (column.headerCheckbox && _angular2.default.isFunction(column.headerCheckboxCallback)) {
                column.headerCheckboxCallback(_this2);
              }
            });
          }, true);
        }
      }
    }, {
      key: "transposeColumnDefaults",
      value: function transposeColumnDefaults() {
        for (var i = 0, len = this.options.columns.length; i < len; i++) {
          var column = this.options.columns[i];
          column.$id = ObjectId();

          _angular2.default.forEach(ColumnDefaults, function (v, k) {
            if (!column.hasOwnProperty(k)) {
              column[k] = v;
            }
          });

          if (column.name && !column.prop) {
            column.prop = CamelCase(column.name);
          }

          this.options.columns[i] = column;
        }
      }
    }, {
      key: "calculateColumns",
      value: function calculateColumns() {
        var columns = this.options.columns;
        this.columnsByPin = ColumnsByPin(columns);
        this.columnWidths = ColumnGroupWidths(this.columnsByPin, columns);
      }
    }, {
      key: "tableCss",
      value: function tableCss() {
        return {
          'fixed': this.options.scrollbarV,
          'selectable': this.options.selectable,
          'checkboxable': this.options.checkboxSelection
        };
      }
    }, {
      key: "adjustColumns",
      value: function adjustColumns(forceIdx) {
        var width = this.options.internal.innerWidth - this.options.internal.scrollBarWidth;

        if (this.options.columnMode === 'force') {
          ForceFillColumnWidths(this.options.columns, width, forceIdx);
        } else if (this.options.columnMode === 'flex') {
          AdjustColumnWidths(this.options.columns, width);
        }
      }
    }, {
      key: "calculatePageSize",
      value: function calculatePageSize() {
        this.options.paging.size = Math.ceil(this.options.internal.bodyHeight / this.options.rowHeight) + 1;
      }
    }, {
      key: "onSorted",
      value: function onSorted() {
        if (!this.rows) return;

        // return all sorted column, in the same order in which they were sorted
        var sorts = this.options.columns.filter(function (c) {
          return c.sort;
        }).sort(function (a, b) {
          // sort the columns with lower sortPriority order first
          if (a.sortPriority && b.sortPriority) {
            if (a.sortPriority > b.sortPriority) return 1;
            if (a.sortPriority < b.sortPriority) return -1;
          } else if (a.sortPriority) {
            return -1;
          } else if (b.sortPriority) {
            return 1;
          }

          return 0;
        }).map(function (c, i) {
          // update sortPriority
          c.sortPriority = i + 1;
          return c;
        });

        if (sorts.length) {
          this.onSort({ sorts: sorts });

          if (this.options.onSort) {
            this.options.onSort(sorts);
          }

          var clientSorts = [];
          for (var i = 0, len = sorts.length; i < len; i++) {
            var c = sorts[i];
            if (c.comparator !== false) {
              var dir = c.sort === 'asc' ? '' : '-';
              if (c.sortBy !== undefined) {
                clientSorts.push(dir + c.sortBy);
              } else {
                clientSorts.push(dir + c.prop);
              }
            }
          }

          if (clientSorts.length) {
            var _rows;

            // todo: more ideal to just resort vs splice and repush
            // but wasn't responding to this change ...
            var sortedValues = this.$filter('orderBy')(this.rows, clientSorts);
            this.rows.splice(0, this.rows.length);
            (_rows = this.rows).push.apply(_rows, _toConsumableArray(sortedValues));
          }
        }

        this.options.internal.setYOffset(0);
      }
    }, {
      key: "onTreeToggled",
      value: function onTreeToggled(row, cell) {
        this.onTreeToggle({
          row: row,
          cell: cell
        });
      }
    }, {
      key: "onBodyPage",
      value: function onBodyPage(offset, size) {
        this.onPage({
          offset: offset,
          size: size
        });
      }
    }, {
      key: "onFooterPage",
      value: function onFooterPage(offset, size) {
        var pageBlockSize = this.options.rowHeight * size,
            offsetY = pageBlockSize * offset;

        this.options.internal.setYOffset(offsetY);
      }
    }, {
      key: "selectAllRows",
      value: function selectAllRows() {
        var _selected;

        this.selected.splice(0, this.selected.length);

        (_selected = this.selected).push.apply(_selected, _toConsumableArray(this.rows));

        return this.isAllRowsSelected();
      }
    }, {
      key: "deselectAllRows",
      value: function deselectAllRows() {
        this.selected.splice(0, this.selected.length);

        return this.isAllRowsSelected();
      }
    }, {
      key: "isAllRowsSelected",
      value: function isAllRowsSelected() {
        return !this.rows || !this.selected ? false : this.selected.length === this.rows.length;
      }
    }, {
      key: "onResized",
      value: function onResized(column, width) {
        var idx = this.options.columns.indexOf(column);
        if (idx > -1) {
          var column = this.options.columns[idx];
          column.width = width;
          column.canAutoResize = false;

          this.adjustColumns(idx);
          this.calculateColumns();
        }

        if (this.onColumnResize) {
          this.onColumnResize({
            column: column,
            width: width
          });
        }
      }
    }, {
      key: "onSelected",
      value: function onSelected(rows) {
        this.onSelect({
          rows: rows
        });
      }
    }, {
      key: "onRowClicked",
      value: function onRowClicked(row) {
        this.onRowClick({
          row: row
        });
      }
    }, {
      key: "onRowDblClicked",
      value: function onRowDblClicked(row) {
        this.onRowDblClick({
          row: row
        });
      }
    }]);

    return DataTableController;
  }();

  /**
   * Debounce helper
   * @param  {function}
   * @param  {int}
   * @param  {boolean}
   */

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

  var DataTableService = {

    // id: [ column defs ]
    columns: {},
    dTables: {},

    saveColumns: function saveColumns(id, columnElms) {
      if (columnElms && columnElms.length) {
        var columnsArray = [].slice.call(columnElms);
        this.dTables[id] = columnsArray;
      }
    },
    buildColumns: function buildColumns(scope, parse) {
      var _this3 = this;

      //FIXME: Too many nested for loops.  O(n3)

      // Iterate through each dTable
      _angular2.default.forEach(this.dTables, function (columnElms, id) {
        _this3.columns[id] = [];

        // Iterate through each column
        _angular2.default.forEach(columnElms, function (c) {
          var column = {};

          var visible = true;
          // Iterate through each attribute
          _angular2.default.forEach(c.attributes, function (attr) {
            var attrName = CamelCase(attr.name);

            // cuz putting className vs class on
            // a element feels weird
            switch (attrName) {
              case 'class':
                column.className = attr.value;
                break;
              case 'name':
              case 'prop':
                column[attrName] = attr.value;
                break;
              case 'headerRenderer':
              case 'cellRenderer':
              case 'cellDataGetter':
                column[attrName] = parse(attr.value);
                break;
              case 'visible':
                visible = parse(attr.value)(scope);
                break;
              default:
                column[attrName] = parse(attr.value)(scope);
                break;
            }
          });

          var header = c.getElementsByTagName('column-header');

          if (header.length) {
            column.headerTemplate = header[0].innerHTML;
            c.removeChild(header[0]);
          }

          if (c.innerHTML !== '') {
            column.template = c.innerHTML;
          }

          if (visible) {
            _this3.columns[id].push(column);
          }
        });
      });

      this.dTables = {};
    }
  };

  function DataTableDirective($window, $timeout, $parse) {
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
      template: function template(element) {
        // Gets the column nodes to transposes to column objects
        // http://stackoverflow.com/questions/30845397/angular-expressive-directive-design/30847609#30847609
        var columns = element[0].getElementsByTagName('column'),
            id = ObjectId();
        DataTableService.saveColumns(id, columns);

        return "<div class=\"dt\" ng-class=\"dt.tableCss()\" data-column-id=\"" + id + "\">\n          <dt-header options=\"dt.options\"\n                     columns=\"dt.columnsByPin\"\n                     column-widths=\"dt.columnWidths\"\n                     ng-if=\"dt.options.headerHeight\"\n                     on-resize=\"dt.onResized(column, width)\"\n                     selected-rows=\"dt.selected\"\n                     all-rows=\"dt.rows\"\n                     on-sort=\"dt.onSorted()\">\n          </dt-header>\n          <dt-body rows=\"dt.rows\"\n                   selected=\"dt.selected\"\n                   expanded=\"dt.expanded\"\n                   columns=\"dt.columnsByPin\"\n                   on-select=\"dt.onSelected(rows)\"\n                   on-row-click=\"dt.onRowClicked(row)\"\n                   on-row-dbl-click=\"dt.onRowDblClicked(row)\"\n                   column-widths=\"dt.columnWidths\"\n                   options=\"dt.options\"\n                   on-page=\"dt.onBodyPage(offset, size)\"\n                   on-tree-toggle=\"dt.onTreeToggled(row, cell)\">\n           </dt-body>\n          <dt-footer ng-if=\"dt.options.footerHeight\"\n                     ng-style=\"{ height: dt.options.footerHeight + 'px' }\"\n                     on-page=\"dt.onFooterPage(offset, size)\"\n                     paging=\"dt.options.paging\">\n           </dt-footer>\n        </div>";
      },
      compile: function compile(tElem, tAttrs) {
        return {
          pre: function pre($scope, $elm, $attrs, ctrl) {
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
            }

            $window.addEventListener('resize', throttle(function () {
              $timeout(resize);
            }));

            // When an item is hidden for example
            // in a tab with display none, the height
            // is not calculated correrctly.  We need to watch
            // the visible attribute and resize if this occurs
            var checkVisibility = function checkVisibility() {
              var bounds = $elm[0].getBoundingClientRect(),
                  visible = bounds.width && bounds.height;
              if (visible) resize();else $timeout(checkVisibility, 100);
            };
            checkVisibility();

            // add a loaded class to avoid flickering
            $elm.addClass('dt-loaded');

            // prevent memory leaks
            $scope.$on('$destroy', function () {
              _angular2.default.element($window).off('resize');
            });
          }
        };
      }
    };
  }

  var cache = {};
  var testStyle = document.createElement('div').style;

  // Get Prefix
  // http://davidwalsh.name/vendor-prefix
  var prefix = function () {
    var styles = window.getComputedStyle(document.documentElement, ''),
        pre = (Array.prototype.slice.call(styles).join('').match(/-(moz|webkit|ms)-/) || styles.OLink === '' && ['', 'o'])[1],
        dom = 'WebKit|Moz|MS|O'.match(new RegExp('(' + pre + ')', 'i'))[1];
    return {
      dom: dom,
      lowercase: pre,
      css: '-' + pre + '-',
      js: pre[0].toUpperCase() + pre.substr(1)
    };
  }();

  /**
   * @param {string} property Name of a css property to check for.
   * @return {?string} property name supported in the browser, or null if not
   * supported.
   */
  function GetVendorPrefixedName(property) {
    var name = CamelCase(property);
    if (!cache[name]) {
      if (testStyle[prefix.css + property] !== undefined) {
        cache[name] = prefix.css + property;
      } else if (testStyle[property] !== undefined) {
        cache[name] = property;
      }
    }
    return cache[name];
  }

  // browser detection and prefixing tools
  var transform = GetVendorPrefixedName('transform');
  var backfaceVisibility = GetVendorPrefixedName('backfaceVisibility');
  var hasCSSTransforms = !!GetVendorPrefixedName('transform');
  var hasCSS3DTransforms = !!GetVendorPrefixedName('perspective');
  var ua = window.navigator.userAgent;
  var isSafari = /Safari\//.test(ua) && !/Chrome\//.test(ua);

  function TranslateXY(styles, x, y) {
    if (hasCSSTransforms) {
      if (!isSafari && hasCSS3DTransforms) {
        styles[transform] = "translate3d(" + x + "px, " + y + "px, 0)";
        styles[backfaceVisibility] = 'hidden';
      } else {
        styles[CamelCase(transform)] = "translate(" + x + "px, " + y + "px)";
      }
    } else {
      styles.top = y + 'px';
      styles.left = x + 'px';
    }
  }

  var HeaderController = function () {
    function HeaderController() {
      _classCallCheck(this, HeaderController);
    }

    _createClass(HeaderController, [{
      key: "styles",
      value: function styles() {
        return {
          width: this.options.internal.innerWidth + 'px',
          height: this.options.headerHeight + 'px'
        };
      }
    }, {
      key: "innerStyles",
      value: function innerStyles() {
        return {
          width: this.columnWidths.total + 'px'
        };
      }
    }, {
      key: "onSorted",
      value: function onSorted(sortedColumn) {
        if (this.options.sortType === 'single') {
          var unsortColumn = function unsortColumn(column) {
            if (column !== sortedColumn) {
              column.sort = undefined;
            }
          };

          this.columns.left.forEach(unsortColumn);
          this.columns.center.forEach(unsortColumn);
          this.columns.right.forEach(unsortColumn);
        }

        this.onSort({
          column: sortedColumn
        });
      }
    }, {
      key: "stylesByGroup",
      value: function stylesByGroup(group) {
        var styles = {
          width: this.columnWidths[group] + 'px'
        };

        if (group === 'center') {
          TranslateXY(styles, this.options.internal.offsetX * -1, 0);
        } else if (group === 'right') {
          var offset = (this.columnWidths.total - this.options.internal.innerWidth) * -1;
          TranslateXY(styles, offset, 0);
        }

        return styles;
      }
    }, {
      key: "onResized",
      value: function onResized(column, width) {
        this.onResize({
          column: column,
          width: width
        });
      }
    }]);

    return HeaderController;
  }();

  function HeaderDirective($timeout) {
    return {
      restrict: 'E',
      controller: HeaderController,
      controllerAs: 'header',
      scope: true,
      bindToController: {
        options: '=',
        columns: '=',
        columnWidths: '=',
        selectedRows: '=?',
        allRows: '=',
        onSort: '&',
        onResize: '&'
      },
      template: "\n      <div class=\"dt-header\" ng-style=\"header.styles()\">\n        <div class=\"dt-header-inner\" ng-style=\"header.innerStyles()\">\n          <div class=\"dt-row-left\"\n               ng-style=\"header.stylesByGroup('left')\"\n               ng-if=\"header.columns['left'].length\"\n               sortable=\"header.options.reorderable\"\n               on-sortable-sort=\"columnsResorted(event, columnId)\">\n            <dt-header-cell\n              ng-repeat=\"column in header.columns['left'] track by column.$id\"\n              on-sort=\"header.onSorted(column)\"\n              options=\"header.options\"\n              sort-type=\"header.options.sortType\"\n              on-resize=\"header.onResized(column, width)\"\n              all-rows=\"header.allRows\"\n              column=\"column\">\n            </dt-header-cell>\n          </div>\n          <div class=\"dt-row-center\"\n               sortable=\"header.options.reorderable\"\n               ng-style=\"header.stylesByGroup('center')\"\n               on-sortable-sort=\"columnsResorted(event, columnId)\">\n            <dt-header-cell\n              ng-repeat=\"column in header.columns['center'] track by column.$id\"\n              on-checkbox-change=\"header.onCheckboxChanged()\"\n              on-sort=\"header.onSorted(column)\"\n              sort-type=\"header.options.sortType\"\n              selected=\"header.isSelected()\"\n              on-resize=\"header.onResized(column, width)\"\n              options=\"header.options\"\n              column=\"column\">\n            </dt-header-cell>\n          </div>\n          <div class=\"dt-row-right\"\n               ng-if=\"header.columns['right'].length\"\n               sortable=\"header.options.reorderable\"\n               ng-style=\"header.stylesByGroup('right')\"\n               on-sortable-sort=\"columnsResorted(event, columnId)\">\n            <dt-header-cell\n              ng-repeat=\"column in header.columns['right'] track by column.$id\"\n              on-checkbox-change=\"header.onCheckboxChanged()\"\n              on-sort=\"header.onSorted(column)\"\n              sort-type=\"header.options.sortType\"\n              selected=\"header.isSelected()\"\n              on-resize=\"header.onResized(column, width)\"\n              options=\"header.options\"\n              column=\"column\">\n            </dt-header-cell>\n          </div>\n        </div>\n      </div>",
      replace: true,
      link: function link($scope, $elm, $attrs, ctrl) {

        $scope.columnsResorted = function (event, columnId) {
          var col = findColumnById(columnId),
              parent = _angular2.default.element(event.currentTarget),
              newIdx = -1;

          _angular2.default.forEach(parent.children(), function (c, i) {
            if (columnId === _angular2.default.element(c).attr('data-id')) {
              newIdx = i;
            }
          });

          $timeout(function () {
            _angular2.default.forEach(ctrl.columns, function (group) {
              var idx = group.indexOf(col);
              if (idx > -1) {

                // this is tricky because we want to update the index
                // in the orig columns array instead of the grouped one
                var curColAtIdx = group[newIdx],
                    siblingIdx = ctrl.options.columns.indexOf(curColAtIdx),
                    curIdx = ctrl.options.columns.indexOf(col);

                ctrl.options.columns.splice(curIdx, 1);
                ctrl.options.columns.splice(siblingIdx, 0, col);

                return false;
              }
            });
          });
        };

        var findColumnById = function findColumnById(columnId) {
          var columns = ctrl.columns.left.concat(ctrl.columns.center).concat(ctrl.columns.right);
          return columns.find(function (c) {
            return c.$id === columnId;
          });
        };
      }
    };
  }

  var HeaderCellController = function () {
    function HeaderCellController($scope) {
      _classCallCheck(this, HeaderCellController);

      this.$scope = $scope;

      if (this.$scope.$parent.$parent.$parent.$parent.dt) {
        this.dt = this.$scope.$parent.$parent.$parent.$parent.dt;
      }

      if (this.column.headerCheckbox) {
        this.column.headerCheckboxCallback = this.rowSelected;
      }
    }
    /**
     * Calculates the styles for the header cell directive
     * @return {styles}
     */


    _createClass(HeaderCellController, [{
      key: "styles",
      value: function styles() {
        return {
          width: this.column.width + 'px',
          minWidth: this.column.minWidth + 'px',
          maxWidth: this.column.maxWidth + 'px',
          height: this.column.height + 'px'
        };
      }
    }, {
      key: "cellClass",
      value: function cellClass() {
        var cls = {
          'sortable': this.column.sortable,
          'resizable': this.column.resizable
        };

        if (this.column.headerClassName) {
          cls[this.column.headerClassName] = true;
        }

        return cls;
      }
    }, {
      key: "onSorted",
      value: function onSorted() {
        if (this.column.sortable) {
          this.column.sort = NextSortDirection(this.sortType, this.column.sort);

          if (this.column.sort === undefined) {
            this.column.sortPriority = undefined;
          }

          this.onSort({
            column: this.column
          });
        }
      }
    }, {
      key: "sortClass",
      value: function sortClass() {
        return {
          'sort-btn': true,
          'sort-asc icon-down': this.column.sort === 'asc',
          'sort-desc icon-up': this.column.sort === 'desc'
        };
      }
    }, {
      key: "onResized",
      value: function onResized(width, column) {
        this.onResize({
          column: column,
          width: width
        });
      }
    }, {
      key: "rowSelected",
      value: function rowSelected(dt) {
        this.allRowsSelected = dt.selected && dt.rows.length === dt.selected.length;
      }
    }, {
      key: "checkboxChangeCallback",
      value: function checkboxChangeCallback() {
        return this.isAllRowsSelected = this.column.allRowsSelected ? this.dt.selectAllRows() : this.dt.deselectAllRows();
      }
    }]);

    return HeaderCellController;
  }();

  function HeaderCellDirective($compile) {
    return {
      restrict: 'E',
      controller: HeaderCellController,
      controllerAs: 'hcell',
      scope: true,
      bindToController: {
        options: '=',
        column: '=',
        onSort: '&',
        sortType: '=',
        onResize: '&',
        selected: '='
      },
      replace: true,
      template: "<div ng-class=\"hcell.cellClass()\"\n            class=\"dt-header-cell\"\n            draggable=\"true\"\n            data-id=\"{{column.$id}}\"\n            ng-style=\"hcell.styles()\"\n            title=\"{{::hcell.column.name}}\">\n        <div resizable=\"hcell.column.resizable\"\n             on-resize=\"hcell.onResized(width, hcell.column)\"\n             min-width=\"hcell.column.minWidth\"\n             max-width=\"hcell.column.maxWidth\">\n          <label ng-if=\"hcell.column.isCheckboxColumn && hcell.column.headerCheckbox\" class=\"dt-checkbox\">\n            <input type=\"checkbox\"\n                   ng-model=\"hcell.column.allRowsSelected\"\n                   ng-change=\"hcell.checkboxChangeCallback()\" />\n          </label>\n          <span class=\"dt-header-cell-label\"\n                ng-click=\"hcell.onSorted()\">\n          </span>\n          <span ng-class=\"hcell.sortClass()\"></span>\n        </div>\n      </div>",
      compile: function compile() {
        return {
          pre: function pre($scope, $elm, $attrs, ctrl) {
            var label = $elm[0].querySelector('.dt-header-cell-label'),
                cellScope = void 0;

            if (ctrl.column.headerTemplate || ctrl.column.headerRenderer) {
              cellScope = ctrl.options.$outer.$new(false);

              // copy some props
              cellScope.$header = ctrl.column.name;
              cellScope.$index = $scope.$index;
            }

            if (ctrl.column.headerTemplate) {
              var elm = _angular2.default.element("<span>" + ctrl.column.headerTemplate.trim() + "</span>");
              _angular2.default.element(label).append($compile(elm)(cellScope));
            } else if (ctrl.column.headerRenderer) {
              var _elm = _angular2.default.element(ctrl.column.headerRenderer($elm));
              _angular2.default.element(label).append($compile(_elm)(cellScope)[0]);
            } else {
              var val = ctrl.column.name;
              if (val === undefined || val === null) val = '';
              label.textContent = val;
            }
          }
        };
      }
    };
  }

  var BodyController = function () {

    /**
     * A tale body controller
     * @param  {$scope}
     * @param  {$timeout}
     * @return {BodyController}
     */
    /*@ngInject*/
    BodyController.$inject = ["$scope", "$timeout"];
    function BodyController($scope, $timeout) {
      var _this4 = this;

      _classCallCheck(this, BodyController);

      this.$scope = $scope;
      this.tempRows = [];
      this.watchListeners = [];

      this.setTreeAndGroupColumns();
      this.setConditionalWatches();
      this.options.refreshRows = this.rowsUpdated.bind(this);

      $scope.$watch(function () {
        return _this4.options.columns;
      }, function (newVal, oldVal) {
        if (newVal) {
          _this4.setTreeAndGroupColumns();

          _this4.setConditionalWatches();

          if (!_this4.options.refreshRows) {
            _this4.options.refreshRows = _this4.rowsUpdated.bind(_this4);
          }
        }
      }, true);

      $scope.$watchCollection('body.rows', this.rowsUpdated.bind(this));
    }

    _createClass(BodyController, [{
      key: "setTreeAndGroupColumns",
      value: function setTreeAndGroupColumns() {
        this.treeColumn = this.options.columns.find(function (c) {
          return c.isTreeColumn;
        });

        this.groupColumn = this.options.columns.find(function (c) {
          return c.group;
        });
      }
    }, {
      key: "setConditionalWatches",
      value: function setConditionalWatches() {
        var _this5 = this;

        this.watchListeners.map(function (watchListener) {
          return watchListener();
        });

        if (this.options.scrollbarV || !this.options.scrollbarV && this.options.paging.externalPaging) {
          var sized = false;
          this.watchListeners.push(this.$scope.$watch('body.options.paging.size', function (newVal, oldVal) {
            if (!sized || newVal > oldVal) {
              _this5.getRows();
              sized = true;
            }
          }));

          this.watchListeners.push(this.$scope.$watch('body.options.paging.count', function (count) {
            _this5.count = count;
            _this5.updatePage();
          }));

          this.watchListeners.push(this.$scope.$watch('body.options.paging.offset', function (newVal) {
            if (_this5.options.paging.size) {
              _this5.onPage({
                offset: newVal,
                size: _this5.options.paging.size
              });
            }
          }));
        }
      }
    }, {
      key: "rowsUpdated",
      value: function rowsUpdated(newVal, oldVal) {
        if (!newVal) {
          this.getRows(true);
        }

        if (newVal) {
          if (!this.options.paging.externalPaging) {
            this.options.paging.count = newVal.length;
          }

          this.count = this.options.paging.count;

          if (this.treeColumn || this.groupColumn) {
            this.buildRowsByGroup();
          }

          if (this.options.scrollbarV) {
            var refresh = newVal && oldVal && (newVal.length === oldVal.length || newVal.length < oldVal.length);

            this.getRows(refresh);
          } else {
            var rows = this.rows;

            if (this.treeColumn) {
              rows = this.buildTree();
            } else if (this.groupColumn) {
              rows = this.buildGroups();
            }

            if (this.options.paging.externalPaging) {
              var idxs = this.getFirstLastIndexes(),
                  idx = idxs.first;

              this.tempRows.splice(0, this.tempRows.length);
              while (idx < idxs.last) {
                this.tempRows.push(rows[idx++]);
              }
            } else {
              var _tempRows;

              this.tempRows.splice(0, this.tempRows.length);
              (_tempRows = this.tempRows).push.apply(_tempRows, _toConsumableArray(rows));
            }
          }
        }
      }
    }, {
      key: "getFirstLastIndexes",
      value: function getFirstLastIndexes() {
        var firstRowIndex, endIndex;

        if (this.options.scrollbarV) {
          firstRowIndex = Math.max(Math.floor((this.options.internal.offsetY || 0) / this.options.rowHeight, 0), 0);
          endIndex = Math.min(firstRowIndex + this.options.paging.size, this.count);
        } else {
          if (this.options.paging.externalPaging) {
            firstRowIndex = Math.max(this.options.paging.offset * this.options.paging.size, 0);
            endIndex = Math.min(firstRowIndex + this.options.paging.size, this.count);
          } else {
            endIndex = this.count;
          }
        }

        return {
          first: firstRowIndex,
          last: endIndex
        };
      }
    }, {
      key: "updatePage",
      value: function updatePage() {
        var curPage = this.options.paging.offset,
            idxs = this.getFirstLastIndexes();

        if (this.options.internal.oldScrollPosition === undefined) {
          this.options.internal.oldScrollPosition = 0;
        }

        var oldScrollPosition = this.options.internal.oldScrollPosition,
            newPage = idxs.first / this.options.paging.size;

        this.options.internal.oldScrollPosition = newPage;

        if (newPage < oldScrollPosition) {
          // scrolling up
          newPage = Math.floor(newPage);
        } else if (newPage > oldScrollPosition) {
          // scrolling down
          newPage = Math.ceil(newPage);
        } else {
          // equal, just stay on the current page
          newPage = curPage;
        }

        if (!isNaN(newPage)) {
          this.options.paging.offset = newPage;
        }
      }
    }, {
      key: "calculateDepth",
      value: function calculateDepth(row) {
        var depth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

        var parentProp = this.treeColumn ? this.treeColumn.relationProp : this.groupColumn.prop;
        var prop = this.treeColumn.prop;
        if (!row[parentProp]) {
          return depth;
        }
        if (row.$$depth) {
          return row.$$depth + depth;
        }
        /* Get data from cache, if exists*/
        var cachedParent = this.index[row[parentProp]];
        if (cachedParent) {
          depth += 1;
          return this.calculateDepth(cachedParent, depth);
        }
        for (var i = 0, len = this.rows.length; i < len; i++) {
          var parent = this.rows[i];
          if (parent[prop] == row[parentProp]) {
            depth += 1;
            return this.calculateDepth(parent, depth);
          }
        }
        return depth;
      }
    }, {
      key: "buildRowsByGroup",
      value: function buildRowsByGroup() {
        this.index = {};
        this.rowsByGroup = {};

        var parentProp = this.treeColumn ? this.treeColumn.relationProp : this.groupColumn.prop;

        for (var i = 0, len = this.rows.length; i < len; i++) {
          var row = this.rows[i];
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
              if (parent === undefined) {
                for (var j = 0; j < len; j++) {
                  if (this.rows[j][prop] == relVal) {
                    parent = this.rows[j];
                    break;
                  }
                }
              }
              if (parent.$$depth === undefined) {
                parent.$$depth = this.calculateDepth(parent);
              }
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
      key: "buildGroups",
      value: function buildGroups() {
        var _this6 = this;

        var temp = [];

        _angular2.default.forEach(this.rowsByGroup, function (v, k) {
          temp.push({
            name: k,
            group: true
          });

          if (_this6.expanded[k]) {
            temp.push.apply(temp, _toConsumableArray(v));
          }
        });

        return temp;
      }
    }, {
      key: "isSelected",
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
      key: "buildTree",
      value: function buildTree() {
        var temp = [],
            self = this;

        function addChildren(fromArray, toArray, level) {
          fromArray.forEach(function (row) {
            var relVal = row[self.treeColumn.relationProp],
                key = row[self.treeColumn.prop],
                groupRows = self.rowsByGroup[key],
                expanded = self.expanded[key];

            if (level > 0 || !relVal) {
              toArray.push(row);
              if (groupRows && groupRows.length > 0 && expanded) {
                addChildren(groupRows, toArray, level + 1);
              }
            }
          });
        }

        addChildren(this.rows, temp, 0);

        return temp;
      }
    }, {
      key: "getRows",
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
            this.tempRows.splice(0, this.tempRows.length);
          }
        } else if (this.groupColumn) {
          temp = this.groupsTemp || [];
          // cache the group build
          if (refresh || !this.groupsTemp) {
            this.groupsTemp = temp = this.buildGroups();
            this.count = temp.length;
          }
        } else {
          temp = this.rows;
          if (refresh === true) {
            this.tempRows.splice(0, this.tempRows.length);
          }
        }

        var idx = 0,
            indexes = this.getFirstLastIndexes(),
            rowIndex = indexes.first;

        // slice out the old rows so we don't have duplicates
        this.tempRows.splice(0, indexes.last - indexes.first);

        while (rowIndex < indexes.last && rowIndex < this.count) {
          var row = temp[rowIndex];
          if (row) {
            row.$$index = rowIndex;
            this.tempRows[idx] = row;
          }
          idx++;
          rowIndex++;
        }

        this.options.internal.styleTranslator.update(this.tempRows);

        return this.tempRows;
      }
    }, {
      key: "styles",
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
      key: "rowStyles",
      value: function rowStyles(row) {
        var styles = {};

        if (this.options.rowHeight === 'auto') {
          styles.height = this.options.rowHeight + 'px';
        }

        return styles;
      }
    }, {
      key: "groupRowStyles",
      value: function groupRowStyles(row) {
        var styles = this.rowStyles(row);
        styles.width = this.columnWidths.total + 'px';
        return styles;
      }
    }, {
      key: "rowClasses",
      value: function rowClasses(row) {
        var styles = {
          'selected': this.isSelected(row),
          'dt-row-even': row && row.$$index % 2 === 0,
          'dt-row-odd': row && row.$$index % 2 !== 0
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
      key: "getRowValue",
      value: function getRowValue(idx) {
        return this.tempRows[idx];
      }
    }, {
      key: "getRowExpanded",
      value: function getRowExpanded(row) {
        if (this.treeColumn) {
          return this.expanded[row[this.treeColumn.prop]];
        } else if (this.groupColumn) {
          return this.expanded[row.name];
        }
      }
    }, {
      key: "getRowHasChildren",
      value: function getRowHasChildren(row) {
        if (!this.treeColumn) return;
        var children = this.rowsByGroup[row[this.treeColumn.prop]];
        return children !== undefined || children && !children.length;
      }
    }, {
      key: "refreshTree",
      value: function refreshTree() {
        if (this.options.scrollbarV) {
          this.getRows(true);
        } else {
          var _tempRows2;

          var values = this.buildTree();
          this.tempRows.splice(0, this.tempRows.length);
          (_tempRows2 = this.tempRows).push.apply(_tempRows2, _toConsumableArray(values));
        }
      }
    }, {
      key: "onTreeToggled",
      value: function onTreeToggled(row, cell) {
        var val = row[this.treeColumn.prop];
        this.expanded[val] = !this.expanded[val];

        this.refreshTree();

        this.onTreeToggle({
          row: row,
          cell: cell
        });
      }
    }, {
      key: "refreshGroups",
      value: function refreshGroups() {
        if (this.options.scrollbarV) {
          this.getRows(true);
        } else {
          var _tempRows3;

          var values = this.buildGroups();
          this.tempRows.splice(0, this.tempRows.length);
          (_tempRows3 = this.tempRows).push.apply(_tempRows3, _toConsumableArray(values));
        }
      }
    }, {
      key: "onGroupToggle",
      value: function onGroupToggle(row) {
        this.expanded[row.name] = !this.expanded[row.name];

        this.refreshGroups();
      }
    }]);

    return BodyController;
  }();

  function BodyDirective($timeout) {
    return {
      restrict: 'E',
      controller: BodyController,
      controllerAs: 'body',
      bindToController: {
        columns: '=',
        columnWidths: '=',
        rows: '=',
        options: '=',
        selected: '=?',
        expanded: '=?',
        onPage: '&',
        onTreeToggle: '&',
        onSelect: '&',
        onRowClick: '&',
        onRowDblClick: '&'
      },
      scope: true,
      template: "\n      <div \n        class=\"progress-linear\" \n        role=\"progressbar\" \n        ng-show=\"body.options.paging.loadingIndicator\">\n        <div class=\"container\">\n          <div class=\"bar\"></div>\n        </div>\n      </div>\n      <div class=\"dt-body\" ng-style=\"body.styles()\" dt-seletion>\n        <dt-scroller class=\"dt-body-scroller\">\n          <dt-group-row ng-repeat-start=\"r in body.tempRows track by $index\"\n                        ng-if=\"r.group\"\n                        ng-style=\"body.groupRowStyles(r)\" \n                        options=\"body.options\"\n                        on-group-toggle=\"body.onGroupToggle(group)\"\n                        expanded=\"body.getRowExpanded(r)\"\n                        tabindex=\"{{$index}}\"\n                        row=\"r\">\n          </dt-group-row>\n          <dt-row ng-repeat-end\n                  ng-if=\"!r.group\"\n                  row=\"body.getRowValue($index)\"\n                  tabindex=\"{{$index}}\"\n                  columns=\"body.columns\"\n                  column-widths=\"body.columnWidths\"\n                  ng-keydown=\"selCtrl.keyDown($event, $index, r)\"\n                  ng-click=\"selCtrl.rowClicked($event, r.$$index, r)\"\n                  ng-dblclick=\"selCtrl.rowDblClicked($event, r.$$index, r)\"\n                  on-tree-toggle=\"body.onTreeToggled(row, cell)\"\n                  ng-class=\"body.rowClasses(r)\"\n                  options=\"body.options\"\n                  selected=\"body.isSelected(r)\"\n                  on-checkbox-change=\"selCtrl.onCheckboxChange($event, $index, row)\"\n                  columns=\"body.columnsByPin\"\n                  has-children=\"body.getRowHasChildren(r)\"\n                  expanded=\"body.getRowExpanded(r)\"\n                  ng-style=\"body.rowStyles(r)\">\n          </dt-row>\n        </dt-scroller>\n        <div ng-if=\"body.rows && !body.rows.length\" \n             class=\"empty-row\" \n             ng-bind=\"::body.options.emptyMessage\">\n       </div>\n       <div ng-if=\"body.rows === undefined\" \n             class=\"loading-row\"\n             ng-bind=\"::body.options.loadingMessage\">\n        </div>\n      </div>"
    };
  }

  /**
   * This translates the dom position based on the model row index.
   * This only exists because Angular's binding process is too slow.
   */

  var StyleTranslator = function () {
    function StyleTranslator(height) {
      _classCallCheck(this, StyleTranslator);

      this.height = height;
      this.map = new Map();
    }

    /**
     * Update the rows
     * @param  {Array} rows
     */


    _createClass(StyleTranslator, [{
      key: "update",
      value: function update(rows) {
        var n = 0;
        while (n <= this.map.size) {
          var dom = this.map.get(n);
          var model = rows[n];
          if (dom && model) {
            TranslateXY(dom[0].style, 0, model.$$index * this.height);
          }
          n++;
        }
      }
    }, {
      key: "register",
      value: function register(idx, dom) {
        this.map.set(idx, dom);
      }
    }]);

    return StyleTranslator;
  }();

  function ScrollerDirective($timeout, $rootScope) {
    return {
      restrict: 'E',
      require: '^dtBody',
      transclude: true,
      replace: true,
      template: "<div ng-style=\"scrollerStyles()\" ng-transclude></div>",
      link: function link($scope, $elm, $attrs, ctrl) {
        var ticking = false,
            lastScrollY = 0,
            lastScrollX = 0,
            parent = $elm.parent();

        ctrl.options.internal.styleTranslator = new StyleTranslator(ctrl.options.rowHeight);

        ctrl.options.internal.setYOffset = function (offsetY) {
          parent[0].scrollTop = offsetY;
        };

        function update() {
          ctrl.options.internal.offsetY = lastScrollY;
          ctrl.options.internal.offsetX = lastScrollX;
          ctrl.updatePage();

          if (ctrl.options.scrollbarV) {
            ctrl.getRows();
          }

          // https://github.com/Swimlane/angular-data-table/pull/74
          ctrl.options.$outer.$digest();

          ticking = false;
        }

        function requestTick() {
          if (!ticking) {
            requestAnimFrame(update);
            ticking = true;
          }
        }

        parent.on('scroll', function (ev) {
          lastScrollY = this.scrollTop;
          lastScrollX = this.scrollLeft;
          requestTick();
        });

        $scope.$on('$destroy', function () {
          parent.off('scroll');
        });

        $scope.scrollerStyles = function () {
          if (ctrl.options.scrollbarV) {
            return {
              height: ctrl.count * ctrl.options.rowHeight + 'px'
            };
          }
        };
      }
    };
  }

  /**
   * Shortcut for key handlers
   * @type {Object}
   */
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

  var SelectionController = function () {

    /*@ngInject*/
    SelectionController.$inject = ["$scope"];
    function SelectionController($scope) {
      _classCallCheck(this, SelectionController);

      this.body = $scope.body;
      this.options = $scope.body.options;
      this.selected = $scope.body.selected;
    }

    /**
     * Handler for the keydown on a row
     * @param  {event}
     * @param  {index}
     * @param  {row}
     */


    _createClass(SelectionController, [{
      key: "keyDown",
      value: function keyDown(ev, index, row) {
        if (KEYS[ev.keyCode]) {
          ev.preventDefault();
        }

        if (ev.keyCode === KEYS.DOWN) {
          var next = ev.target.nextElementSibling;
          if (next) {
            next.focus();
          }
        } else if (ev.keyCode === KEYS.UP) {
          var prev = ev.target.previousElementSibling;
          if (prev) {
            prev.focus();
          }
        } else if (ev.keyCode === KEYS.RETURN) {
          this.selectRow(index, row);
        }
      }
    }, {
      key: "rowClicked",
      value: function rowClicked(event, index, row) {
        if (!this.options.checkboxSelection) {
          // event.preventDefault();
          this.selectRow(event, index, row);
        }

        this.body.onRowClick({ row: row });
      }
    }, {
      key: "rowDblClicked",
      value: function rowDblClicked(event, index, row) {
        if (!this.options.checkboxSelection) {
          event.preventDefault();
          this.selectRow(event, index, row);
        }

        this.body.onRowDblClick({ row: row });
      }
    }, {
      key: "onCheckboxChange",
      value: function onCheckboxChange(event, index, row) {
        this.selectRow(event, index, row);
      }
    }, {
      key: "selectRow",
      value: function selectRow(event, index, row) {
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
                if (this.options.multiSelectOnShift && this.selected.length === 1) {
                  this.selected.splice(0, 1);
                }
                this.selected.push(row);
                this.body.onSelect({ rows: [row] });
              }
            }
            this.prevIndex = index;
          } else {
            this.selected = row;
            this.body.onSelect({ rows: [row] });
          }
        }
      }
    }, {
      key: "selectRowsBetween",
      value: function selectRowsBetween(index) {
        var reverse = index < this.prevIndex,
            selecteds = [];

        for (var i = 0, len = this.body.rows.length; i < len; i++) {
          var row = this.body.rows[i],
              greater = i >= this.prevIndex && i <= index,
              lesser = i <= this.prevIndex && i >= index;

          var range = {};
          if (reverse) {
            range = {
              start: index,
              end: this.prevIndex - index
            };
          } else {
            range = {
              start: this.prevIndex,
              end: index + 1
            };
          }

          if (reverse && lesser || !reverse && greater) {
            var idx = this.selected.indexOf(row);
            // if reverse shift selection (unselect) and the
            // row is already selected, remove it from selected
            if (reverse && idx > -1) {
              this.selected.splice(idx, 1);
              continue;
            }
            // if in the positive range to be added to `selected`, and
            // not already in the selected array, add it
            if (i >= range.start && i < range.end) {
              if (idx === -1) {
                this.selected.push(row);
                selecteds.push(row);
              }
            }
          }
        }

        this.body.onSelect({ rows: selecteds });
      }
    }]);

    return SelectionController;
  }();

  function SelectionDirective() {
    return {
      controller: SelectionController,
      restrict: 'A',
      require: '^dtBody',
      controllerAs: 'selCtrl'
    };
  }

  var RowController = function () {
    function RowController() {
      _classCallCheck(this, RowController);
    }

    _createClass(RowController, [{
      key: "getValue",
      value: function getValue(col) {
        if (!col.prop) return '';
        return DeepValueGetter(this.row, col.prop);
      }
    }, {
      key: "onTreeToggled",
      value: function onTreeToggled(cell) {
        this.onTreeToggle({
          cell: cell,
          row: this.row
        });
      }
    }, {
      key: "stylesByGroup",
      value: function stylesByGroup(group) {
        var styles = {
          width: this.columnWidths[group] + 'px'
        };

        if (group === 'left') {
          TranslateXY(styles, this.options.internal.offsetX, 0);
        } else if (group === 'right') {
          var offset = (this.columnWidths.total - this.options.internal.innerWidth - this.options.internal.offsetX + this.options.internal.scrollBarWidth) * -1;
          TranslateXY(styles, offset, 0);
        }

        return styles;
      }
    }, {
      key: "onCheckboxChanged",
      value: function onCheckboxChanged(ev) {
        this.onCheckboxChange({
          $event: ev,
          row: this.row
        });
      }
    }]);

    return RowController;
  }();

  function RowDirective() {
    return {
      restrict: 'E',
      controller: RowController,
      controllerAs: 'rowCtrl',
      scope: true,
      bindToController: {
        row: '=',
        columns: '=',
        columnWidths: '=',
        expanded: '=',
        selected: '=',
        hasChildren: '=',
        options: '=',
        onCheckboxChange: '&',
        onTreeToggle: '&'
      },
      link: function link($scope, $elm, $attrs, ctrl) {
        if (ctrl.row) {
          // inital render position
          TranslateXY($elm[0].style, 0, ctrl.row.$$index * ctrl.options.rowHeight);
        }

        // register w/ the style translator
        ctrl.options.internal.styleTranslator.register($scope.$index, $elm);
      },
      template: "\n      <div class=\"dt-row\">\n        <div class=\"dt-row-left dt-row-block\"\n             ng-if=\"rowCtrl.columns['left'].length\"\n             ng-style=\"rowCtrl.stylesByGroup('left')\">\n          <dt-cell ng-repeat=\"column in rowCtrl.columns['left'] track by column.$id\"\n                   on-tree-toggle=\"rowCtrl.onTreeToggled(cell)\"\n                   column=\"column\"\n                   options=\"rowCtrl.options\"\n                   has-children=\"rowCtrl.hasChildren\"\n                   on-checkbox-change=\"rowCtrl.onCheckboxChanged($event)\"\n                   selected=\"rowCtrl.selected\"\n                   expanded=\"rowCtrl.expanded\"\n                   row=\"rowCtrl.row\"\n                   value=\"rowCtrl.getValue(column)\">\n          </dt-cell>\n        </div>\n        <div class=\"dt-row-center dt-row-block\"\n             ng-style=\"rowCtrl.stylesByGroup('center')\">\n          <dt-cell ng-repeat=\"column in rowCtrl.columns['center'] track by column.$id\"\n                   on-tree-toggle=\"rowCtrl.onTreeToggled(cell)\"\n                   column=\"column\"\n                   options=\"rowCtrl.options\"\n                   has-children=\"rowCtrl.hasChildren\"\n                   expanded=\"rowCtrl.expanded\"\n                   selected=\"rowCtrl.selected\"\n                   row=\"rowCtrl.row\"\n                   on-checkbox-change=\"rowCtrl.onCheckboxChanged($event)\"\n                   value=\"rowCtrl.getValue(column)\">\n          </dt-cell>\n        </div>\n        <div class=\"dt-row-right dt-row-block\"\n             ng-if=\"rowCtrl.columns['right'].length\"\n             ng-style=\"rowCtrl.stylesByGroup('right')\">\n          <dt-cell ng-repeat=\"column in rowCtrl.columns['right'] track by column.$id\"\n                   on-tree-toggle=\"rowCtrl.onTreeToggled(cell)\"\n                   column=\"column\"\n                   options=\"rowCtrl.options\"\n                   has-children=\"rowCtrl.hasChildren\"\n                   selected=\"rowCtrl.selected\"\n                   on-checkbox-change=\"rowCtrl.onCheckboxChanged($event)\"\n                   row=\"rowCtrl.row\"\n                   expanded=\"rowCtrl.expanded\"\n                   value=\"rowCtrl.getValue(column)\">\n          </dt-cell>\n        </div>\n      </div>",
      replace: true
    };
  }

  var GroupRowController = function () {
    function GroupRowController() {
      _classCallCheck(this, GroupRowController);
    }

    _createClass(GroupRowController, [{
      key: "onGroupToggled",
      value: function onGroupToggled(evt) {
        evt.stopPropagation();
        this.onGroupToggle({
          group: this.row
        });
      }
    }, {
      key: "treeClass",
      value: function treeClass() {
        return {
          'dt-tree-toggle': true,
          'icon-right': !this.expanded,
          'icon-down': this.expanded
        };
      }
    }]);

    return GroupRowController;
  }();

  function GroupRowDirective() {
    return {
      restrict: 'E',
      controller: GroupRowController,
      controllerAs: 'group',
      bindToController: {
        row: '=',
        onGroupToggle: '&',
        expanded: '=',
        options: '='
      },
      scope: true,
      replace: true,
      template: "\n      <div class=\"dt-group-row\">\n        <span ng-class=\"group.treeClass()\"\n              ng-click=\"group.onGroupToggled($event)\">\n        </span>\n        <span class=\"dt-group-row-label\" ng-bind=\"group.row.name\">\n        </span>\n      </div>",
      link: function link($scope, $elm, $attrs, ctrl) {
        // inital render position
        TranslateXY($elm[0].style, 0, ctrl.row.$$index * ctrl.options.rowHeight);

        // register w/ the style translator
        ctrl.options.internal.styleTranslator.register($scope.$index, $elm);
      }
    };
  }

  var CellController = function () {
    function CellController() {
      _classCallCheck(this, CellController);
    }

    _createClass(CellController, [{
      key: "styles",
      value: function styles() {
        return {
          width: this.column.width + 'px',
          'min-width': this.column.width + 'px'
        };
      }
    }, {
      key: "cellClass",
      value: function cellClass() {
        var style = {
          'dt-tree-col': this.column.isTreeColumn
        };

        if (this.column.className) {
          style[this.column.className] = true;
        }

        return style;
      }
    }, {
      key: "treeClass",
      value: function treeClass() {
        return {
          'dt-tree-toggle': true,
          'icon-right': !this.expanded,
          'icon-down': this.expanded
        };
      }
    }, {
      key: "onTreeToggled",
      value: function onTreeToggled(evt) {
        evt.stopPropagation();
        this.expanded = !this.expanded;
        this.onTreeToggle({
          cell: {
            value: this.value,
            column: this.column,
            expanded: this.expanded
          }
        });
      }
    }, {
      key: "onCheckboxChanged",
      value: function onCheckboxChanged(event) {
        event.stopPropagation();
        this.onCheckboxChange({ $event: event });
      }
    }, {
      key: "getValue",
      value: function getValue() {
        var val = this.column.cellDataGetter ? this.column.cellDataGetter(this.value) : this.value;

        if (val === undefined || val === null) val = '';
        return val;
      }
    }]);

    return CellController;
  }();

  function CellDirective($rootScope, $compile, $log, $timeout) {
    return {
      restrict: 'E',
      controller: CellController,
      scope: true,
      controllerAs: 'cell',
      bindToController: {
        options: '=',
        value: '=',
        selected: '=',
        column: '=',
        row: '=',
        expanded: '=',
        hasChildren: '=',
        onTreeToggle: '&',
        onCheckboxChange: '&'
      },
      template: "<div class=\"dt-cell\"\n            data-title=\"{{::cell.column.name}}\"\n            ng-style=\"cell.styles()\"\n            ng-class=\"cell.cellClass()\">\n        <label ng-if=\"cell.column.isCheckboxColumn\" class=\"dt-checkbox\">\n          <input type=\"checkbox\"\n                 ng-checked=\"cell.selected\"\n                 ng-click=\"cell.onCheckboxChanged($event)\" />\n        </label>\n        <span ng-if=\"cell.column.isTreeColumn && cell.hasChildren\"\n              ng-class=\"cell.treeClass()\"\n              ng-click=\"cell.onTreeToggled($event)\"></span>\n        <span class=\"dt-cell-content\"></span>\n      </div>",
      replace: true,
      compile: function compile() {
        return {
          pre: function pre($scope, $elm, $attrs, ctrl) {
            var content = _angular2.default.element($elm[0].querySelector('.dt-cell-content')),
                cellScope;

            // extend the outer scope onto our new cell scope
            if (ctrl.column.template || ctrl.column.cellRenderer) {
              createCellScope();
            }

            $scope.$watch('cell.row', function () {
              if (cellScope) {
                cellScope.$destroy();

                createCellScope();

                cellScope.$cell = ctrl.value;
                cellScope.$row = ctrl.row;
                cellScope.$column = ctrl.column;
                cellScope.$$watchers = null;
              }

              if (ctrl.column.template) {
                content.empty();
                var elm = _angular2.default.element("<span>" + ctrl.column.template.trim() + "</span>");
                content.append($compile(elm)(cellScope));
              } else if (ctrl.column.cellRenderer) {
                content.empty();
                var elm = _angular2.default.element(ctrl.column.cellRenderer(cellScope, content));
                content.append($compile(elm)(cellScope));
              } else {
                content[0].innerHTML = ctrl.getValue();
              }
            }, true);

            function createCellScope() {
              cellScope = ctrl.options.$outer.$new(false);
              cellScope.getValue = ctrl.getValue;
            }
          }
        };
      }
    };
  }

  var FooterController = function () {

    /**
     * Creates an instance of the Footer Controller
     * @param  {scope}
     * @return {[type]}
     */
    /*@ngInject*/
    FooterController.$inject = ["$scope"];
    function FooterController($scope) {
      var _this7 = this;

      _classCallCheck(this, FooterController);

      this.page = this.paging.offset + 1;
      $scope.$watch('footer.paging.offset', function (newVal) {
        _this7.offsetChanged(newVal);
      });
    }

    /**
     * The offset ( page ) changed externally, update the page
     * @param  {new offset}
     */


    _createClass(FooterController, [{
      key: "offsetChanged",
      value: function offsetChanged(newVal) {
        this.page = newVal + 1;
      }
    }, {
      key: "onPaged",
      value: function onPaged(page) {
        this.paging.offset = page - 1;
        this.onPage({
          offset: this.paging.offset,
          size: this.paging.size
        });
      }
    }]);

    return FooterController;
  }();

  function FooterDirective() {
    return {
      restrict: 'E',
      controller: FooterController,
      controllerAs: 'footer',
      scope: true,
      bindToController: {
        paging: '=',
        onPage: '&'
      },
      template: "<div class=\"dt-footer\">\n        <div class=\"page-count\">{{footer.paging.count}} total</div>\n        <dt-pager page=\"footer.page\"\n               size=\"footer.paging.size\"\n               count=\"footer.paging.count\"\n               on-page=\"footer.onPaged(page)\"\n               ng-show=\"footer.paging.count / footer.paging.size > 1\">\n         </dt-pager>\n      </div>",
      replace: true
    };
  }

  var PagerController = function () {

    /**
     * Creates an instance of the Pager Controller
     * @param  {object} $scope   
     */
    /*@ngInject*/
    PagerController.$inject = ["$scope"];
    function PagerController($scope) {
      var _this8 = this;

      _classCallCheck(this, PagerController);

      $scope.$watch('pager.count', function (newVal) {
        _this8.calcTotalPages(_this8.size, _this8.count);
        _this8.getPages(_this8.page || 1);
      });

      $scope.$watch('pager.size', function (newVal) {
        _this8.calcTotalPages(_this8.size, _this8.count);
        _this8.getPages(_this8.page || 1);
      });

      $scope.$watch('pager.page', function (newVal) {
        if (newVal !== 0 && newVal <= _this8.totalPages) {
          _this8.getPages(newVal);
        }
      });

      this.getPages(this.page || 1);
    }

    /**
     * Calculates the total number of pages given the count.
     * @return {int} page count
     */


    _createClass(PagerController, [{
      key: "calcTotalPages",
      value: function calcTotalPages(size, count) {
        var count = size < 1 ? 1 : Math.ceil(count / size);
        this.totalPages = Math.max(count || 0, 1);
      }
    }, {
      key: "selectPage",
      value: function selectPage(num) {
        if (num > 0 && num <= this.totalPages) {
          this.page = num;
          this.onPage({
            page: num
          });
        }
      }
    }, {
      key: "prevPage",
      value: function prevPage() {
        if (this.page > 1) {
          this.selectPage(--this.page);
        }
      }
    }, {
      key: "nextPage",
      value: function nextPage() {
        this.selectPage(++this.page);
      }
    }, {
      key: "canPrevious",
      value: function canPrevious() {
        return this.page > 1;
      }
    }, {
      key: "canNext",
      value: function canNext() {
        return this.page < this.totalPages;
      }
    }, {
      key: "getPages",
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

        /*
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
        */

        this.pages = pages;
      }
    }]);

    return PagerController;
  }();

  function PagerDirective() {
    return {
      restrict: 'E',
      controller: PagerController,
      controllerAs: 'pager',
      scope: true,
      bindToController: {
        page: '=',
        size: '=',
        count: '=',
        onPage: '&'
      },
      template: "<div class=\"dt-pager\">\n        <ul class=\"pager\">\n          <li ng-class=\"{ disabled: !pager.canPrevious() }\">\n            <a href ng-click=\"pager.selectPage(1)\" class=\"icon-prev\"></a>\n          </li>\n          <li ng-class=\"{ disabled: !pager.canPrevious() }\">\n            <a href ng-click=\"pager.prevPage()\" class=\"icon-left\"></a>\n          </li>\n          <li ng-repeat=\"pg in pager.pages track by $index\" ng-class=\"{ active: pg.active }\">\n            <a href ng-click=\"pager.selectPage(pg.number)\">{{pg.text}}</a>\n          </li>\n          <li ng-class=\"{ disabled: !pager.canNext() }\">\n            <a href ng-click=\"pager.nextPage()\" class=\"icon-right\"></a>\n          </li>\n          <li ng-class=\"{ disabled: !pager.canNext() }\">\n            <a href ng-click=\"pager.selectPage(pager.totalPages)\" class=\"icon-skip\"></a>\n          </li>\n        </ul>\n      </div>",
      replace: true
    };
  }

  var POSITION = {
    LEFT: 'left',
    RIGHT: 'right',
    TOP: 'top',
    BOTTOM: 'bottom',
    CENTER: 'center'
  };

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

      if (_angular2.default.isString(template) && plain) {
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
        var v = value.toString().toLowerCase();
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
          text: $attributes.popoverText,
          template: $attributes.popoverTemplate,
          plain: toBoolean($attributes.popoverPlain || false),
          placement: $attributes.popoverPlacement || 'right',
          alignment: $attributes.popoverAlignment || 'center',
          group: $attributes.popoverGroup,
          spacing: parseInt($attributes.popoverSpacing) || 0,
          showCaret: toBoolean($attributes.popoverPlain || false)
        };

        // attach exit and enter events to element
        $element.off('mouseenter', display);
        $element.on('mouseenter', display);
        $element.off('mouseleave', mouseOut);
        $element.on('mouseleave', mouseOut);

        function mouseOut() {
          $scope.exitTimeout = $timeout(remove, 500);
        }

        /**
         * Displays the popover on the page
         */
        function display() {
          // Cancel exit timeout
          $timeout.cancel($scope.exitTimeout);

          var elm = document.getElementById("#" + $scope.popoverId);
          if ($scope.popover && elm) return;

          // remove other popovers from the same group
          if ($scope.options.group) {
            PopoverRegistry.removeGroup($scope.options.group, $scope.popoverId);
          }

          if ($scope.options.text && !$scope.options.template) {
            $scope.popover = _angular2.default.element("<div class=\"dt-popover popover-text\n            popover" + $scope.options.placement + "\" id=\"" + $scope.popoverId + "\"></div>");

            $scope.popover.html($scope.options.text);
            _angular2.default.element(document.body).append($scope.popover);
            positionPopover($element, $scope.popover, $scope.options);
            PopoverRegistry.add($scope.popoverId, { element: $element, popover: $scope.popover, group: $scope.options.group });
          } else {
            $q.when(loadTemplate($scope.options.template, $scope.options.plain)).then(function (template) {
              if (!_angular2.default.isString(template)) {
                if (template.data && _angular2.default.isString(template.data)) {
                  template = template.data;
                } else {
                  template = '';
                }
              }

              $scope.popover = _angular2.default.element("<div class=\"dt-popover\n              popover-" + $scope.options.placement + "\" id=\"" + $scope.popoverId + "\"></div>");

              $scope.popover.html(template);
              $compile($scope.popover)($scope);
              _angular2.default.element(document.body).append($scope.popover);
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
        }

        /**
         * Removes the template from the registry and page
         */
        function remove() {
          if ($scope.popover) {
            $scope.popover.remove();
          }

          $scope.popover = undefined;
          PopoverRegistry.remove($scope.popoverId);
        }

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

            if (options.placement === POSITION.RIGHT) {
              left = elDimensions.left + elDimensions.width + options.spacing;
              top = PositionHelper.calculateVerticalAlignment(elDimensions, popoverDimensions, options.alignment);
            }
            if (options.placement === POSITION.LEFT) {
              left = elDimensions.left - popoverDimensions.width - options.spacing;
              top = PositionHelper.calculateVerticalAlignment(elDimensions, popoverDimensions, options.alignment);
            }
            if (options.placement === POSITION.TOP) {
              top = elDimensions.top - popoverDimensions.height - options.spacing;
              left = PositionHelper.calculateHorizontalAlignment(elDimensions, popoverDimensions, options.alignment);
            }
            if (options.placement === POSITION.BOTTOM) {
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

            $animate.addClass($scope.popover, 'popover-animation');
          }, 50);
        }

        /**
         * Adds a caret and positions it relatively to the popover
         * @param {object} popoverEl
         * @param {object} elDimensions
         * @param {object} popoverDimensions
         */
        function addCaret(popoverEl, elDimensions, popoverDimensions) {
          var caret = _angular2.default.element("<span class=\"popover-caret caret-" + $scope.options.placement + "\"></span>");
          popoverEl.append(caret);
          var caretDimensions = caret[0].getBoundingClientRect();

          var left, top;
          if ($scope.options.placement === POSITION.RIGHT) {
            left = -6;
            top = PositionHelper.calculateVerticalCaret(elDimensions, popoverDimensions, caretDimensions, $scope.options.alignment);
          }
          if ($scope.options.placement === POSITION.LEFT) {
            left = popoverDimensions.width - 2;
            top = PositionHelper.calculateVerticalCaret(elDimensions, popoverDimensions, caretDimensions, $scope.options.alignment);
          }
          if ($scope.options.placement === POSITION.TOP) {
            top = popoverDimensions.height - 5;
            left = PositionHelper.calculateHorizontalCaret(elDimensions, popoverDimensions, caretDimensions, $scope.options.alignment);
          }

          if ($scope.options.placement === POSITION.BOTTOM) {
            top = -8;
            left = PositionHelper.calculateHorizontalCaret(elDimensions, popoverDimensions, caretDimensions, $scope.options.alignment);
          }

          caret.css({
            top: top + 'px',
            left: left + 'px'
          });
        }
      }
    };
  }

  /**
   * Registering to deal with popovers
   * @param {function} $animate
   */
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

  /**
   * Position helper for the popover directive.
   */

  function PositionHelper() {
    return {
      calculateVerticalAlignment: function calculateVerticalAlignment(elDimensions, popoverDimensions, alignment) {
        switch (alignment) {
          case POSITION.TOP:
            return elDimensions.top;
          case POSITION.BOTTOM:
            return elDimensions.top + elDimensions.height - popoverDimensions.height;
          case POSITION.CENTER:
            return elDimensions.top + elDimensions.height / 2 - popoverDimensions.height / 2;
          default:
            return console.log('calculateVerticalAlignment issue', this);
        }
      },

      calculateVerticalCaret: function calculateVerticalCaret(elDimensions, popoverDimensions, caretDimensions, alignment) {
        switch (alignment) {
          case POSITION.TOP:
            return elDimensions.height / 2 - caretDimensions.height / 2 - 1;
          case POSITION.BOTTOM:
            return popoverDimensions.height - elDimensions.height / 2 - caretDimensions.height / 2 - 1;
          case POSITION.CENTER:
            return popoverDimensions.height / 2 - caretDimensions.height / 2 - 1;
          default:
            return console.log('calculateVerticalCaret issue', this);
        }
      },

      calculateHorizontalCaret: function calculateHorizontalCaret(elDimensions, popoverDimensions, caretDimensions, alignment) {
        switch (alignment) {
          case POSITION.LEFT:
            return elDimensions.width / 2 - caretDimensions.height / 2 - 1;
          case POSITION.RIGHT:
            return popoverDimensions.width - elDimensions.width / 2 - caretDimensions.height / 2 - 1;
          case POSITION.CENTER:
            return popoverDimensions.width / 2 - caretDimensions.height / 2 - 1;
          default:
            return console.log('calculateHorizontalCaret issue', this);
        }
      },

      calculateHorizontalAlignment: function calculateHorizontalAlignment(elDimensions, popoverDimensions, alignment) {
        switch (alignment) {
          case POSITION.LEFT:
            return elDimensions.left;
          case POSITION.RIGHT:
            return elDimensions.left + elDimensions.width - popoverDimensions.width;
          case POSITION.CENTER:
            return elDimensions.left + elDimensions.width / 2 - popoverDimensions.width / 2;
          default:
            return console.log('calculateHorizontalAlignment issue', this);
        }
      }
    };
  }

  var popover = _angular2.default.module('dt.popover', []).service('PopoverRegistry', PopoverRegistry).factory('PositionHelper', PositionHelper).directive('popover', PopoverDirective);

  var MenuController = function () {

    /*@ngInject*/
    MenuController.$inject = ["$scope", "$timeout"];
    function MenuController($scope, $timeout) {
      _classCallCheck(this, MenuController);

      this.$scope = $scope;
    }

    _createClass(MenuController, [{
      key: "getColumnIndex",
      value: function getColumnIndex(model) {
        return this.$scope.current.findIndex(function (col) {
          return model.name == col.name;
        });
      }
    }, {
      key: "isChecked",
      value: function isChecked(model) {
        return this.getColumnIndex(model) > -1;
      }
    }, {
      key: "onCheck",
      value: function onCheck(model) {
        var idx = this.getColumnIndex(model);
        if (idx === -1) {
          this.$scope.current.push(model);
        } else {
          this.$scope.current.splice(idx, 1);
        }
      }
    }]);

    return MenuController;
  }();

  function MenuDirective() {
    return {
      restrict: 'E',
      controller: 'MenuController',
      controllerAs: 'dtm',
      scope: {
        current: '=',
        available: '='
      },
      template: "<div class=\"dt-menu dropdown\" close-on-click=\"false\">\n        <a href=\"#\" class=\"dropdown-toggle icon-add\">\n          Configure Columns\n        </a>\n        <div class=\"dropdown-menu\" role=\"menu\" aria-labelledby=\"dropdown\">\n          <div class=\"keywords\">\n            <input type=\"text\" \n                   click-select\n                   placeholder=\"Filter columns...\" \n                   ng-model=\"columnKeyword\" \n                   autofocus />\n          </div>\n          <ul>\n            <li ng-repeat=\"column in available | filter:columnKeyword\">\n              <label class=\"dt-checkbox\">\n                <input type=\"checkbox\" \n                       ng-checked=\"dtm.isChecked(column)\"\n                       ng-click=\"dtm.onCheck(column)\">\n                {{column.name}}\n              </label>\n            </li>\n          </ul>\n        </div>\n      </div>"
    };
  }

  var DropdownController = function () {
    /*@ngInject*/
    DropdownController.$inject = ["$scope"];
    function DropdownController($scope) {
      _classCallCheck(this, DropdownController);

      $scope.open = false;
    }

    _createClass(DropdownController, [{
      key: "toggle",
      value: function toggle(scope) {
        scope.open = !scope.open;
      }
    }]);

    return DropdownController;
  }();

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
        }

        function keydown(ev) {
          if (ev.which === 27) {
            $timeout(function () {
              $scope.open = false;
              off();
            });
          }
        }

        function off() {
          $document.unbind('click', closeDropdown);
          $document.unbind('keydown', keydown);
        }

        $scope.$watch('open', function (newVal) {
          if (newVal) {
            $document.bind('click', closeDropdown);
            $document.bind('keydown', keydown);
          }
        });
      }
    };
  }

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
        }

        function toggleDestroy() {
          $elm.unbind('click', toggleClick);
        }

        $elm.bind('click', toggleClick);
        $scope.$on('$destroy', toggleDestroy);
      }
    };
  }

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
  }

  var dropdown = _angular2.default.module('dt.dropdown', []).controller('DropdownController', DropdownController).directive('dropdown', DropdownDirective).directive('dropdownToggle', DropdownToggleDirective).directive('dropdownMenu', DropdownMenuDirective);

  var menu = _angular2.default.module('dt.menu', [dropdown.name]).controller('MenuController', MenuController).directive('dtm', MenuDirective);

  var dataTable = _angular2.default.module('data-table', []).directive('dtable', DataTableDirective).directive('resizable', ResizableDirective).directive('sortable', SortableDirective).directive('dtHeader', HeaderDirective).directive('dtHeaderCell', HeaderCellDirective).directive('dtBody', BodyDirective).directive('dtScroller', ScrollerDirective).directive('dtSeletion', SelectionDirective).directive('dtRow', RowDirective).directive('dtGroupRow', GroupRowDirective).directive('dtCell', CellDirective).directive('dtFooter', FooterDirective).directive('dtPager', PagerDirective);

  exports.dtPopover = popover;
  exports.dtMenu = menu;
  exports.default = dataTable;
});