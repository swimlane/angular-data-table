System.register(['angular', 'utils/utils'], function (_export) {
  'use strict';

  var angular, ColumnsByPin, ColumnGroupWidths;

  _export('ColumnTotalWidth', ColumnTotalWidth);

  /**
   * Calculates the total width of all columns and their groups
   * @param {int}
   */

  _export('GetTotalFlexGrow', GetTotalFlexGrow);

  /**
   * Calculates the Total Flex Grow width.
   * @param {array}
   */

  _export('DistributeFlexWidth', DistributeFlexWidth);

  /**
   * Distributes the flex widths to the columns
   * @param {array} columns
   * @param {int} flex width
   */

  _export('AdjustColumnWidths', AdjustColumnWidths);

  /**
   * Adjusts the column widths.
   * Inspired by: https://github.com/facebook/fixed-data-table/blob/master/src/FixedDataTableWidthHelper.js
   * @param {array} all columns
   * @param {int} width
   */

  _export('ForceFillColumnWidths', ForceFillColumnWidths);

  /**
   * Forces the width of the columns to 
   * distribute equally but overflowing when nesc.
   * @param {array} allColumns 
   * @param {int} expectedWidth
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

  function AdjustColumnWidths(allColumns, expectedWidth) {
    var columnsWidth = ColumnTotalWidth(allColumns),
        remainingFlexGrow = GetTotalFlexGrow(allColumns),
        remainingFlexWidth = Math.max(expectedWidth - columnsWidth, 0),
        colsByGroup = ColumnsByPin(allColumns);

    angular.forEach(colsByGroup, function (cols) {
      var columnGroupFlexGrow = GetTotalFlexGrow(cols),
          columnGroupFlexWidth = Math.floor(columnGroupFlexGrow / remainingFlexGrow * remainingFlexWidth),
          newColumnSettings = DistributeFlexWidth(cols, columnGroupFlexWidth);

      remainingFlexGrow -= columnGroupFlexGrow;
      remainingFlexWidth -= columnGroupFlexWidth;
    });
  }

  function ForceFillColumnWidths(allColumns, expectedWidth) {
    var colsByGroup = ColumnsByPin(allColumns),
        widthsByGroup = ColumnGroupWidths(colsByGroup, allColumns),
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

  return {
    setters: [function (_angular) {
      angular = _angular['default'];
    }, function (_utilsUtils) {
      ColumnsByPin = _utilsUtils.ColumnsByPin;
      ColumnGroupWidths = _utilsUtils.ColumnGroupWidths;
    }],
    execute: function () {}
  };
});