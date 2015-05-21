    link: function($scope, $elm, $attrs){

      //$elm.on('click', function(ev){
      //  debugger;
      //});

    }
    /* compile : function(tElement, tAttrs, transclude) {
      return {
        post: function($scope, elm, attrs, controller) {

          $scope.$watchCollection('values', (newVal, oldVal) => {
            console.log('collection updated');
          });
        }
      }
    } */


      /*var createFrags = function(cols, data){
    var frag = document.createDocumentFragment();

    data.forEach((d) => {
      cols.forEach((c) => {
        var div = document.createElement("div");
        div.textContent = d[c];
        frag.appendChild(div);
      });
    });

    return frag;
  };*/


/* 
export var ForceFill = function(){

  var totalWidth = tableOptions.view.width,
    fixedColumnsWidth = 0,
    tableColumns = tableOptions.columns || [],
    availableContentWidth = totalWidth - fixedColumnsWidth,
    columnsToResize = tableColumns.filter(function(c){ return c.canAutoResize });

  // reset the column sizes so that when new columns are added
  // to an existing column set, you don't get multiplier effect
  columnsToResize.forEach(function(column) {
    if(column.oldColumnWidth){
        column.columnWidth = column.oldColumnWidth;
    }
  });

  var contentWidth = factory.totalWidths(tableColumns),
    remainingWidth = availableContentWidth - contentWidth,
    additionWidthPerColumn = Math.floor(remainingWidth / columnsToResize.length),
    oldWidths = factory.totalWidths(tableColumns, 'oldColumnWidth'),
    oldLargerThanNew = oldWidths > totalWidth;

  columnsToResize.forEach(function(column) {
    var newSize = column.columnWidth + additionWidthPerColumn;

    // cache first size
    if(!column.oldColumnWidth){
        column.oldColumnWidth = column.columnWidth;
    }

    column.columnWidth = oldLargerThanNew ? 
        column.oldColumnWidth : newSize;
  }); 

  
  // greed formula
  // SpaceLeft := LineWidth - (Width(Word) + SpaceWidth)

};
*/