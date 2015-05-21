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

    $scope.options = angular.extend(angular.
      copy(TableDefaults), $scope.options);

    $scope.options.columns.forEach((c, i) => {
      c = angular.extend(angular.copy(ColumnDefaults), c);
      if(c.height){
        c.height = TableDefaults.headerHeight;
      }
      $scope.options.columns[i] = c;
    });

    if($scope.options.selectable && $scope.options.multiSelect){
      $scope.selected = $scope.selected || [];
    }

	}
}

function Directive(){
  return {
    restrict: 'E',
    replace: true,
    controller: 'DataTable',
    scope: {
      options: '=',
      values: '=',
      onSelect: '&',
      selected: '='
    },
    controllerAs: 'dt',
    template: 
      `<div class="dt material">
        <dt-header columns="options.columns"></dt-header>
        <dt-body values="values" 
                 selected="selected"
                 options="options">
         </dt-body>
        <dt-footer></dt-footer>
      </div>`,
    link: function($scope, $elm, $attrs){
      $scope._innerWidth = $elm[0].offsetWidth;
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

