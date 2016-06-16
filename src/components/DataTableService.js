import angular from 'angular';
import { ColumnDefaults } from '../defaults';
import { CamelCase } from '../utils/utils';

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
        let column = {};

        var visible = true;
        // Iterate through each attribute
        angular.forEach(c.attributes, (attr) => {
          let attrName = CamelCase(attr.name);

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
            case 'visible':
              visible = parse(attr.value)(scope);
              break;
            default:
              column[attrName] = parse(attr.value)(scope);
              break;
          }
        });

        let header = c.getElementsByTagName('column-header');
        if(header.length){
          column.headerTemplate = header[0].innerHTML;
          c.removeChild(header[0])
        }

        if (c.innerHTML !== '') {
          column.template = c.innerHTML;
        }

        if (visible)
          this.columns[id].push(column);
      });
    });

    this.dTables = {};
  }
};
