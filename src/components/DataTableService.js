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
  rawColumnElms: {},

  saveColumns(id, columnElms) {
    if (columnElms && columnElms.length) {
      this.rawColumnElms[id] = columnElms;
    }
  },

  /**
   * Create columns from elements
   * @param  {array} columnElms
   */
  buildColumns(scope, parse) {
    angular.forEach(this.rawColumnElms, (columnElms, id) => {
      this.columns[id] = [];

      angular.forEach(columnElms, (c) => {
        var column = {};

        angular.forEach(c.attributes, (attr) => {
          var attrName = CamelCase(attr.name);

          // cuz putting className vs class on
          // a element feels weird
          if (attrName === 'class') {
            column.className = attr.value;
          } else if (attrName === 'name' || attrName === 'prop') {
            column[attrName] = attr.value;
          } else if (attrName === 'headerRenderer' ||
            attrName === 'cellRenderer' ||
            attrName === 'cellDataGetter') {
            column[attrName] = parse(attr.value);
          } else if (ColumnDefaults.hasOwnProperty(attrName)) {
            column[attrName] = parse(attr.value)(scope);
          }
        });

        if (c.innerHTML !== '') {
          column.template = c.innerHTML;
        }

        this.columns[id].push(column);
      });
    });
  }
};
