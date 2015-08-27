import angular from 'angular';
import { ColumnDefaults } from '../defaults';
import { CamelCase } from '../utils/utils';

export let DataTableService = {

  // id: [ column defs ]
  columns: {},

  buildAndSaveColumns(id, columnElms){
    if(columnElms && columnElms.length){
      this.columns[id] = this.buildColumns(columnElms);
    }
  },

  /**
   * Create columns from elements
   * @param  {array} columnElms 
   */
  buildColumns(columnElms){
    var columns = [];

    angular.forEach(columnElms, (c) => {
      var column = {};

      angular.forEach(c.attributes, (attr) => {
        var attrName = CamelCase(attr.name);

        if(ColumnDefaults.hasOwnProperty(attrName)){
          var val = attr.value;

          if(!isNaN(attr.value)){
            val = parseInt(attr.value);
          }

          column[attrName] = val;
        }

        // cuz putting className vs class on 
        // a element feels weird
        if(attrName === 'class'){
          column.className = attr.value;
        }

        if(attrName === 'name' || attrName === 'prop'){
          column[attrName] = attr.value;
        }
      });

      if(c.innerHTML !== ''){
        column.template = c.innerHTML;
      }

      columns.push(column);
    });

    return columns;
  }

};
