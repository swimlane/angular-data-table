import angular from 'angular';
import throttle from './utils/throttle';

import { TableDefaults, ColumnDefaults } from './defaults';

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

      // TODO
      //if(c.height){
      //  c.height = TableDefaults.headerHeight;
      //}

      $scope.options.columns[i] = c;
    });

    if($scope.options.selectable && $scope.options.multiSelect){
      $scope.selected = $scope.selected || [];
    }

    $scope.options.cache = {};
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
        <dt-header options="options"></dt-header>
        <dt-body values="values" 
                 selected="selected"
                 options="options">
         </dt-body>
        <dt-footer></dt-footer>
      </div>`,
    compile: function(tElem, tAttrs){
      return {
        pre: function($scope, $elm, $attrs){
          $scope.options.cache.innerWidth = $elm[0].offsetWidth;

          if($scope.options.scrollbarV){
            $scope.options.cache.bodyHeight = $elm[0].offsetHeight - $scope.options.headerHeight;

            if($scope.options.hasFooter){
              $scope.options.cache.bodyHeight = $scope.options.cache.bodyHeight - $scope.options.footerHeight;
            }
          }
        }
      }
    }
  };
};

export default angular
  .module('data-table', [ throttle.name ])

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

