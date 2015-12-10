import angular from 'angular';
import { ColumnsByPin, ColumnGroupWidths } from './utils';

/**
 * Calculates the total width of all columns and their groups
 * @param {array} columns
 * @param {string} property width to get
 */
export function ColumnTotalWidth(columns, prop) {
  var totalWidth = 0;

  columns.forEach((c) => {
    var has = prop && c[prop];
    totalWidth = totalWidth + (has ? c[prop] : c.width);
  });

  return totalWidth;
}

/**
 * Calculates the Total Flex Grow
 * @param {array}
 */
export function GetTotalFlexGrow(columns){
  var totalFlexGrow = 0;

  for (let c of columns) {
    totalFlexGrow += c.flexGrow || 0;
  }

  return totalFlexGrow;
}

/**
 * Adjusts the column widths.
 * Inspired by: https://github.com/facebook/fixed-data-table/blob/master/src/FixedDataTableWidthHelper.js
 * @param {array} all columns
 * @param {int} width
 */
export function AdjustColumnWidths(allColumns, expectedWidth){
  var columnsWidth = ColumnTotalWidth(allColumns),
      totalFlexGrow = GetTotalFlexGrow(allColumns),
      colsByGroup = ColumnsByPin(allColumns);

  if (columnsWidth !== expectedWidth){
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
  angular.forEach(colsByGroup, (cols) => {
    cols.forEach((column) => {
      if (!column.canAutoResize){
        maxWidth -= column.width;
        totalFlexGrow -= column.flexGrow;
      } else {
        column.width = 0;
      }
    });
  });

  var hasMinWidth = {}
  var remainingWidth = maxWidth;

  // resize columns until no width is left to be distributed
  do {
    let widthPerFlexPoint = remainingWidth / totalFlexGrow;
    remainingWidth = 0;
    angular.forEach(colsByGroup, (cols) => {
      cols.forEach((column, i) => {
        // if the column can be resize and it hasn't reached its minimum width yet
        if (column.canAutoResize && !hasMinWidth[i]){
          let newWidth = column.width  + column.flexGrow * widthPerFlexPoint;
          if (column.minWidth !== undefined && newWidth < column.minWidth){
            remainingWidth += newWidth - column.minWidth;
            column.width = column.minWidth;
            hasMinWidth[i] = true;
          } else {
            column.width = newWidth;
          }
        }
      });
    });
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
export function ForceFillColumnWidths(allColumns, expectedWidth, startIdx){
  var contentWidth = 0,
      columnsToResize = startIdx > -1 ?
        allColumns.slice(startIdx, allColumns.length).filter((c) => { return c.canAutoResize }) :
        allColumns.filter((c) => { return c.canAutoResize });

  allColumns.forEach((c) => {
    if(!c.canAutoResize){
      contentWidth += c.width;
    } else {
      contentWidth += (c.$$oldWidth || c.width);
    }
  });

  var remainingWidth = expectedWidth - contentWidth,
      additionWidthPerColumn = remainingWidth / columnsToResize.length,
      exceedsWindow = contentWidth > expectedWidth;

  columnsToResize.forEach((column) => {
    if(exceedsWindow){
      column.width = column.$$oldWidth || column.width;
    } else {
      if(!column.$$oldWidth){
        column.$$oldWidth = column.width;
      }

      var newSize = column.$$oldWidth + additionWidthPerColumn;
      if(column.minWith && newSize < column.minWidth){
        column.width = column.minWidth;
      } else if(column.maxWidth && newSize > column.maxWidth){
        column.width = column.maxWidth;
      } else {
        column.width = newSize;
      }
    }
  });
}
