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
 * Calculates the Total Flex Grow width.
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

  for(var i=0, len=columns.length; i < len; i++) {
    var column = columns[i];

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
  }

  return {
    width: totalWidth
  };
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
  var colsByGroup = ColumnsByPin(allColumns),
      widthsByGroup = ColumnGroupWidths(colsByGroup, allColumns),
      availableWidth = expectedWidth - (widthsByGroup.left + widthsByGroup.right),
      centerColumns = allColumns.filter((c) => { return !c.frozenLeft && !c.frozenRight });

  var columnsToResize = startIdx > -1 ? 
      allColumns.slice(startIdx, allColumns.length).filter((c) => { return !c.$$resized }) :
      allColumns.filter((c) => { return !c.$$resized });

 /* var contentWidth2 = 0;
  allColumns.forEach((c) => {
    if(c.$$resized){
      contentWidth2 = contentWidth2 + c.width;
    } else {
      contentWidth2 = contentWidth2 + (c.$$oldWidth || c.width);
    }
  }); 
 */
  var contentWidth = ColumnTotalWidth(columnsToResize, '$$oldWidth');

  //console.log(contentWidth, contentWidth2)

  var remainingWidth = availableWidth - contentWidth,
      additionWidthPerColumn = Math.floor(remainingWidth / colsByGroup.center.length),
      exceedsWindow = contentWidth > widthsByGroup.center;

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
