import angular from 'angular';
import { TableDefaults, ColumnDefaults } from './defaults';
import { Directive } from './directive';
import './data-table.css!'

class DataTable {
	constructor($scope)
	{
    /* var obj = {
      foo: 'd'
    };

    Object.observe(obj, () => {
      console.log('here')
    })

    obj.foo = "do" */
	}
}

// data-title="Column Name"

export default angular
  .module('data-table', [])
  .controller('DataTable', DataTable)
  .directive('dt', Directive);
