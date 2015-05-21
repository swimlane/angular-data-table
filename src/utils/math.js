// https://github.com/facebook/fixed-data-table/blob/master/src/FixedDataTableScrollHelper.js
// https://github.com/facebook/fixed-data-table/blob/master/src/FixedDataTableWidthHelper.js

export var ColumnTotalWidth = function(columns) {
  var totalWidth = 0;

  columns.forEach((c) => {
    totalWidth += c.width;
  });

  return totalWidth;
};

export var getTotalFlexGrow = function(columns){
  var totalFlexGrow = 0;

  columns.forEach((c) => {
    totalFlexGrow += c.flexGrow || 0;
  });

  return totalFlexGrow;
}
