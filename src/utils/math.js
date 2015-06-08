import angular from 'angular';
import { ColumnsByPin, ColumnGroupWidths } from 'utils/utils';

/**
 * Calculates the total width of all columns and their groups
 * @param {int}
 */
export function ColumnTotalWidth(columns) {
  var totalWidth = 0;

  columns.forEach((c) => {
    totalWidth += c.width;
  });

  return totalWidth;
}

/**
 * Calculates the Total Flex Grow width.
 * @param {array}
 */
export function GetTotalFlexGrow(columns){
  var totalFlexGrow = 0;

  columns.forEach((c) => {
    totalFlexGrow += c.flexGrow || 0;
  });

  return totalFlexGrow;
}

/**
 * Distributes the flex widths to the columns
 * @param {array} columns
 * @param {int} flex width
 */
export function DistributeFlexWidth(columns, flexWidth) {
  if (flexWidth <= 0) {
    return {
      columns: columns,
      width: ColumnTotalWidth(columns),
    };
  }

  var remainingFlexGrow = GetTotalFlexGrow(columns),
      remainingFlexWidth = flexWidth,
      totalWidth = 0;

  columns.forEach((column) => {
    if (!column.flexGrow) {
      totalWidth += column.width;
      return;
    }

    var columnFlexWidth = Math.floor(column.flexGrow / remainingFlexGrow * remainingFlexWidth),
        newColumnWidth = Math.floor(column.width + columnFlexWidth);

    if(column.minWidth && newColumnWidth < column.minWidth){
      newColumnWidth = column.minWidth;
    }

    if(column.maxWidth && newColumnWidth > column.maxWidth){
      newColumnWidth = column.maxWidth;
    }

    totalWidth += newColumnWidth;
    remainingFlexGrow -= column.flexGrow;
    remainingFlexWidth -= columnFlexWidth;

    column.width = newColumnWidth;
  });

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
export function AdjustColumnWidths(allColumns, expectedWidth){
  var columnsWidth = ColumnTotalWidth(allColumns),
      remainingFlexGrow = GetTotalFlexGrow(allColumns),
      remainingFlexWidth = Math.max(expectedWidth - columnsWidth, 0),
      colsByGroup = ColumnsByPin(allColumns);

  angular.forEach(colsByGroup, (cols) => {
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
export function ForceFillColumnWidths(allColumns, expectedWidth){
  var colsByGroup = ColumnsByPin(allColumns),
      widthsByGroup = ColumnGroupWidths(colsByGroup, allColumns),
      availableWidth = expectedWidth - (widthsByGroup.left + widthsByGroup.right);

  colsByGroup.center.forEach(function(column) {
    if(column.$$oldWidth){
      column.width = column.$$oldWidth;
    }
  });

  var contentWidth = ColumnTotalWidth(colsByGroup.center),
      remainingWidth = availableWidth - contentWidth,
      additionWidthPerColumn = Math.floor(remainingWidth / colsByGroup.center.length),
      oldLargerThanNew = contentWidth > widthsByGroup.center;

  allColumns.forEach(function(column) {
    if(!column.frozenLeft && !column.frozenRight){
      // cache first size
      if(!column.$$oldWidth){
        column.$$oldWidth = column.width;
      }

      var newSize = column.width + additionWidthPerColumn;
      column.width = oldLargerThanNew ? column.$$oldWidth : newSize;
    }
  });
}
