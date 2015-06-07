import angular from 'angular';
import { ColumnsByPin } from 'utils/utils';

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
