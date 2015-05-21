import angular from 'angular';

import { TableDefaults, ColumnDefaults } from './defaults';
//import { Repeater } from './utils/repeat';

import { HeaderController, HeaderDirective } from './directives/header/header';
import { HeaderCellDirective, HeaderCellController } from './directives/header/header-cell';

import { BodyController, BodyDirective } from './directives/body/body';
import { RowController, RowDirective } from './directives/body/row';
import { CellController, CellDirective } from './directives/body/cell';

import './data-table.css!'

class DataTable {
	constructor($scope){

    $scope.columns = $scope.options.columns.map((c) => {
      var extended = angular.extend(angular.copy(ColumnDefaults), c);
      if(extended.height){
        extended.height = TableDefaults.headerHeight;
      }
      return extended;
    });

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
        <dt-header columns="columns"></dt-header>
        <dt-body values="values" columns="columns"></dt-body>
        <dt-footer></dt-footer>
      </div>`,
    link: function($scope, $elm, $attrs){
      //console.log($scope.options)
    }
  };
};

export default angular
  .module('data-table', [])

  //.directive('repeater', Repeater)

  .controller('DataTable', DataTable)
  .directive('dt', Directive)

  .controller('HeaderController', HeaderController)
  .directive('dtHeader', HeaderDirective)

  .controller('HeaderCellController', HeaderCellController)
  .directive('dtHeaderCell', HeaderCellDirective)

  .controller('BodyController', BodyController)
  .directive('dtBody', BodyDirective)

  .controller('RowController', RowController)
  .directive('dtRow', RowDirective)

  .controller('CellController', CellController)
  .directive('dtCell', CellDirective)

