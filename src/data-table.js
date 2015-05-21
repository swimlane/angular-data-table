import angular from 'angular';
import { TableDefaults, ColumnDefaults } from './defaults';
import { CellController, CellDirective } from './directives/cell';
import { RowController, RowDirective } from './directives/row';
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
      model: '=',
      onSelect: '&'
    },
    controllerAs: 'dt',
    template: 
      `<div class="dt material">
        <dt-header></dt-th>
        <div class="dt-body">
          <div class="dt-scroller">
            <div class="dt-row">
              foo
            </div>
          </div>
        </div>
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

  .controller('RowController', RowController)
  .directive('dtRow', RowDirective)

  .controller('CellController', CellController)
  .directive('dtCell', CellDirective)

