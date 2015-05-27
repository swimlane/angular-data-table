import angular from 'angular';
import sorty from 'sorty';
import { Resizable } from 'utils/resizable';
import { Sortable } from 'utils/sortable';
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
    this.$scope = $scope;

    $scope.options = angular.extend(angular.
      copy(TableDefaults), $scope.options);

    $scope.options.columns.forEach((c, i) => {
      c = angular.extend(angular.copy(ColumnDefaults), c);

      if(!c.height){
        c.height = TableDefaults.headerHeight;
      }

      $scope.options.columns[i] = c;
    });

    if($scope.options.selectable && $scope.options.multiSelect){
      $scope.selected = $scope.selected || [];
    }

    // this is not idea ... todo better
    $scope.$watch('options.columns', (newVal, oldVal) => {
      var sorted = false;

      newVal.forEach((c, i) => {
        var old = oldVal[i];
        if(c.prop === old.prop && c.sort !== oldVal[i].sort){
          sorted = true;
        }
      });

      this.sort(newVal, $scope.values);
    }, true);
	}

  sort(cols, rows){
    var sorts = cols.filter((c) => {
      return c.sort;
    });

    if(sorts.length){
      this.$scope.onSort({ sorts: sorts });

      var clientSorts = sorts.filter((c) => {
        return c.comparator !== false;
      }).map((c) => {
        return {
          name: c.prop,
          dir: c.sort,
          fn: c.comparator
        }
      });

      if(clientSorts.length){
        sorty(clientSorts, rows);
      }
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
      onSort: '&',
      selected: '='
    },
    controllerAs: 'dt',
    template: 
      `<div class="dt material">
        <dt-header options="options" 
                   ng-if="options.headerHeight"></dt-header>
        <dt-body values="values" 
                 selected="selected"
                 options="options">
         </dt-body>
        <dt-footer ng-if="options.footerHeight"></dt-footer>
      </div>`,
    compile: function(tElem, tAttrs){
      return {
        pre: function($scope, $elm, $attrs){
          $scope.options.cache.innerWidth = $elm[0].offsetWidth;

          if($scope.options.scrollbarV){
            var height = $elm[0].offsetHeight;

            if($scope.options.headerHeight){
              height = height - $scope.options.headerHeight;
            }

            if($scope.options.footerHeight){
              height = height - $scope.options.footerHeight;
            }

            $scope.options.cache.bodyHeight = height;
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
  
  .directive('resizable', Resizable)
  .directive('sortable', Sortable)

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

