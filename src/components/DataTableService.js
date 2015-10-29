import angular from 'angular';
import {
  ColumnDefaults
}
from '../defaults';
import {
  CamelCase
}
from '../utils/utils';

export let DataTableService = {

  // id: [ column defs ]
  columns: {},
  dTables: {},

  saveColumns(id, columnElms) {
    if (columnElms && columnElms.length) {
      let columnsArray = [].slice.call(columnElms);
      this.dTables[id] = columnsArray;
    }
  },

  /**
   * Create columns from elements
   * @param  {array} columnElms
   */
  buildColumns(scope, parse) {
    //FIXME: Too many nested for loops.  O(n3)

    // Iterate through each dTable
    angular.forEach(this.dTables, (columnElms, id) => {
      this.columns[id] = [];

      // Iterate through each column
      angular.forEach(columnElms, (c) => {
        var column = {};

        // Iterate through each attribute
        angular.forEach(c.attributes, (attr) => {
          var attrName = CamelCase(attr.name);

          // cuz putting className vs class on
          // a element feels weird
          switch (attrName) {
            case 'class':
              column.className = attr.value;
              break;
            case 'name':
            case 'prop':
              column[attrName] = attr.value;
              break;
            case 'headerRenderer':
            case 'cellRenderer':
            case 'cellDataGetter':
              column[attrName] = parse(attr.value);
              break;
            default:
              column[attrName] = parse(attr.value)(scope);
              break;
          }
        });

        if (c.innerHTML !== '') {
          column.template = c.innerHTML;
        }

        this.columns[id].push(column);
      });
    });
    this.dTables = {};
  }
};
