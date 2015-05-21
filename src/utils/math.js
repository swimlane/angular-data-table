export var ColumnTotalWidth = function(columns) {
  var totalWidth = 0;

  columns.forEach((c, i) => {
    totalWidth += columns[i].width;
  });

  return totalWidth;
}
