System.register(['angular'], function (_export) {
  'use strict';

  var angular, CellController;

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  _export('CellDirective', CellDirective);

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function CellDirective($rootScope, $compile, $log) {
    return {
      restrict: 'E',
      controller: 'CellController',
      controllerAs: 'cell',
      scope: {
        value: '=',
        selected: '=',
        column: '=',
        expanded: '=',
        hasChildren: '=',
        onTreeToggle: '&',
        onCheckboxChange: '&'
      },
      template: '<div class="dt-cell" \n            data-title="{{::column.name}}" \n            ng-style="cell.styles(column)"\n            ng-class="cell.cellClass(column)">\n        <label ng-if="column.isCheckboxColumn" class="dt-checkbox">\n          <input type="checkbox" \n                 ng-checked="selected"\n                 ng-click="cell.onCheckboxChange(this)" />\n        </label>\n        <span ng-if="column.isTreeColumn && hasChildren"\n              ng-class="cell.treeClass(this)"\n              ng-click="cell.onTreeToggle($event, this)"></span>\n        <span class="dt-cell-content"></span>\n      </div>',
      replace: true,
      compile: function compile() {
        return {
          pre: function pre($scope, $elm, $attrs, ctrl) {
            var content = angular.element($elm[0].querySelector('.dt-cell-content'));

            $scope.$watch('value', function () {
              content.empty();

              if ($scope.column.cellRenderer) {
                var elm = angular.element($scope.column.cellRenderer($scope, content));
                content.append($compile(elm)($scope));
              } else {
                content[0].innerHTML = ctrl.getValue($scope);
              }
            });
          }
        };
      }
    };
  }

  return {
    setters: [function (_angular) {
      angular = _angular['default'];
    }],
    execute: function () {
      CellController = (function () {
        function CellController() {
          _classCallCheck(this, CellController);
        }

        _createClass(CellController, [{
          key: 'styles',

          /**
           * Calculates the styles for the Cell Directive
           * @param  {column}
           * @return {styles object}
           */
          value: function styles(col) {
            return {
              width: col.width + 'px'
            };
          }
        }, {
          key: 'cellClass',

          /**
           * Calculates the css classes for the cell directive
           * @param  {column}
           * @return {class object}
           */
          value: function cellClass(col) {
            var style = {
              'dt-tree-col': col.isTreeColumn
            };

            if (col.className) {
              style[col.className] = true;
            }

            return style;
          }
        }, {
          key: 'treeClass',

          /**
           * Calculates the tree class styles.
           * @param  {scope}
           * @return {css classes object}
           */
          value: function treeClass(scope) {
            return {
              'dt-tree-toggle': true,
              'icon-right': !scope.expanded,
              'icon-down': scope.expanded
            };
          }
        }, {
          key: 'onTreeToggle',

          /**
           * Invoked when the tree toggle button was clicked.
           * @param  {event}
           * @param  {scope}
           */
          value: function onTreeToggle(evt, scope) {
            evt.stopPropagation();
            scope.expanded = !scope.expanded;
            scope.onTreeToggle({
              cell: {
                value: scope.value,
                column: scope.column,
                expanded: scope.expanded
              }
            });
          }
        }, {
          key: 'onCheckboxChange',

          /**
           * Invoked when the checkbox was changed
           * @param  {object} scope 
           */
          value: function onCheckboxChange(scope) {
            scope.onCheckboxChange();
          }
        }, {
          key: 'getValue',

          /**
           * Returns the value in its fomatted form
           * @param  {object} scope 
           * @return {string} value
           */
          value: function getValue(scope) {
            var val = scope.column.cellDataGetter ? scope.column.cellDataGetter(scope.value) : scope.value;

            if (val === undefined || val === null) val = '';

            return val;
          }
        }]);

        return CellController;
      })();

      _export('CellController', CellController);

      ;

      ;
    }
  };
});