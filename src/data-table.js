import angular from 'angular';
import { TableDefaults, ColumnDefaults } from './defaults';

import { BodyController, BodyDirective } from './directives/body';
import { RowController, RowDirective } from './directives/row';
import { CellController, CellDirective } from './directives/cell';

import './data-table.css!'

class DataTable {
	constructor($scope){
    /*Object.observe(obj, () => {
      console.log('here')
    })*/
	}
}

function Directive(){
  return {
    restrict: 'E',
    controller: 'DataTable',
    scope: {
      options: '=',
      values: '=',
      onSelect: '&'
    },
    controllerAs: 'dt',
    template: 
      `<div class="dt material">
        <dt-header></dt-header>
        <dt-body values="values" columns="options.columns"></dt-body>
        <dt-footer></dt-footer>
      </div>`,
    link: function($scope, $elm, $attrs){
      console.log($scope.options)
    }
  };
};

export default angular
  .module('data-table', [])

  .controller('DataTable', DataTable)
  .directive('dt', Directive)

  .controller('BodyController', BodyController)
  .directive('dtBody', BodyDirective)

  .controller('RowController', RowController)
  .directive('dtRow', RowDirective)

  .controller('CellController', CellController)
  .directive('dtCell', CellDirective)

