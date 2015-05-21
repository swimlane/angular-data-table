export var ColumnTotalWidth = function(columns) {
  var totalWidth = 0;

  columns.forEach((c) => {
    totalWidth += c.width;
  });

  return totalWidth;
};

function getTotalFlexGrow(columns){
  var totalFlexGrow = 0;

  columns.forEach((c) => {
    totalFlexGrow += c.flexGrow || 0;
  });

  return totalFlexGrow;
}
