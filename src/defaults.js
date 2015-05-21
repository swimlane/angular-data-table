export var TableDefaults = Object.freeze({

  scrollbarV: true,

  scrollbarH: true,

  // The row height, which is necessary 
  // to calculate the height for the lazy rendering.
  rowHeight: 30,

  // Expands the columns to fill the given width.
  forceFillColumns: true,

  // The minimum header height in pixels.
  headerHeight: 30,

  // The minimum footer height in pixels.
  footerHeight: 30,

  // Shows the header block.
  hasHeader: true,

  // Shows a the footer block.
  hasFooter: true,

  paging: {
    // Determine if you should reset page size based on height of grid
    autoPageSize: true,

    // Pages based on scrolling
    virtualScrolling: true,

    // Page you've paged to, this is the next
    // server range to get
    offset: 0,

    // Page size
    pageSize: undefined,

    // Total count
    count: 0,

    // Page you are on, just for counter reflections
    page: 1
  },

  // if users can select itmes
  selectable: true,

  // if users can select mutliple items
  multiSelect: true,

  // if all columns are sortable
  sortable: true,

  positions: {

    // Value of vertical scroll.
    scrollTop: 0,

    // Index of row to scroll to.
    scrollToRow: undefined,

    // Index of column to scroll to.
    scrollToColumn: 0,

    // Value of horizontal scroll.
    scrollLeft: undefined

  }

});

export var ColumnDefaults = Object.freeze({

  className: '',

  // The grow factor relative to other columns. Same as the flex-grow 
  // API from http://www.w3.org/TR/css3-flexbox/. Basically, 
  // take any available extra width and distribute it proportionally 
  // according to all columns' flexGrow values.
  flexGrow: 0,

  // Minimum width of the column.
  minWidth: undefined,

  //Maximum width of the column.
  maxWidth: undefined,

  // The width of the column, by default (in pixels).
  width: 150,

  // If yes then the column can be resized, otherwise it cannot.
  resizable: true,

  // If yes then the column can be sorted.
  sortable: true,

  // Default sort asecending/descending for the column
  sort: undefined,

  // If yes then column will automatically resized to be 
  // larger when there is additional space for the table.
  canAutoResize: true

});
