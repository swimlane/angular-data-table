System.register(['angular', 'utils/resizable'], function (_export) {
  'use strict';

  var angular, Resizable, HeaderCellController;

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  _export('HeaderCellDirective', HeaderCellDirective);

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function HeaderCellDirective($compile) {
    return {
      restrict: 'E',
      controller: 'HeaderCellController',
      controllerAs: 'hcell',
      scope: {
        column: '=',
        onCheckboxChange: '&',
        onSort: '&',
        onResize: '&',
        selected: '='
      },
      replace: true,
      template: '<div ng-class="hcell.cellClass(this)"\n            ng-style="hcell.styles(this)"\n            title="{{::column.name}}">\n        <div resizable="column.resizable" \n             on-resize="hcell.onResize(this, width, column)"\n             min-width="column.minWidth"\n             max-width="column.maxWidth">\n          <label ng-if="column.isCheckboxColumn && column.headerCheckbox" class="dt-checkbox">\n            <input type="checkbox" \n                   ng-checked="selected"\n                   ng-click="hcell.onCheckboxChange(this)" />\n          </label>\n          <span class="dt-header-cell-label" \n                ng-click="hcell.sort(this)">\n          </span>\n          <span ng-class="hcell.sortClass(this)"></span>\n        </div>\n      </div>',
      compile: function compile() {
        return {
          pre: function pre($scope, $elm, $attrs, ctrl) {
            var label = $elm[0].querySelector('.dt-header-cell-label');

            if ($scope.column.headerRenderer) {
              var elm = angular.element($scope.column.headerRenderer($scope, $elm));
              angular.element(label).append($compile(elm)($scope)[0]);
            } else {
              var val = $scope.column.name;
              if (val === undefined || val === null) val = '';
              label.innerHTML = val;
            }
          }
        };
      }
    };
  }

  return {
    setters: [function (_angular) {
      angular = _angular['default'];
    }, function (_utilsResizable) {
      Resizable = _utilsResizable.Resizable;
    }],
    execute: function () {
      HeaderCellController = (function () {
        function HeaderCellController() {
          _classCallCheck(this, HeaderCellController);
        }

        _createClass(HeaderCellController, [{
          key: 'styles',

          /**
           * Calculates the styles for the header cell directive
           * @param  {scope}
           * @return {styles}
           */
          value: function styles(scope) {
            return {
              width: scope.column.width + 'px',
              minWidth: scope.column.minWidth + 'px',
              maxWidth: scope.column.maxWidth + 'px',
              height: scope.column.height + 'px'
            };
          }
        }, {
          key: 'cellClass',

          /**
           * Calculates the css classes for the header cell directive
           * @param  {scope}
           */
          value: function cellClass(scope) {
            var cls = {
              'sortable': scope.column.sortable,
              'dt-header-cell': true,
              'resizable': scope.column.resizable
            };

            if (scope.column.heaerClassName) {
              cls[scope.column.heaerClassName] = true;
            }

            return cls;
          }
        }, {
          key: 'sort',

          /**
           * Toggles the sorting on the column
           * @param  {scope}
           */
          value: function sort(scope) {
            if (scope.column.sortable) {
              if (!scope.column.sort) {
                scope.column.sort = 'asc';
              } else if (scope.column.sort === 'asc') {
                scope.column.sort = 'desc';
              } else if (scope.column.sort === 'desc') {
                scope.column.sort = undefined;
              }

              scope.onSort({
                column: scope.column
              });
            }
          }
        }, {
          key: 'sortClass',

          /**
           * Toggles the css class for the sort button
           * @param  {scope}
           */
          value: function sortClass(scope) {
            return {
              'sort-btn': true,
              'sort-asc icon-down': scope.column.sort === 'asc',
              'sort-desc icon-up': scope.column.sort === 'desc'
            };
          }
        }, {
          key: 'onResize',

          /**
           * Updates the column width on resize
           * @param  {width}
           * @param  {column}
           */
          value: function onResize(scope, width, column) {
            scope.onResize({
              column: column,
              width: width
            });
            //column.width = width;
          }
        }, {
          key: 'onCheckboxChange',

          /**
           * Invoked when the header cell directive checkbox was changed
           * @param  {object} scope angularjs scope
           */
          value: function onCheckboxChange(scope) {
            scope.onCheckboxChange();
          }
        }]);

        return HeaderCellController;
      })();

      _export('HeaderCellController', HeaderCellController);

      ;
    }
  };
});