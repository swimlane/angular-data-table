System.register(['angular', './dropdown'], function (_export) {
  'use strict';

  var angular, Dropdown, DataTableMenuController;

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function DataTableMenuDirective() {
    return {
      restrict: 'E',
      controller: 'DataTableMenuController',
      controllerAs: 'dtm',
      scope: {
        current: '=',
        available: '='
      },
      template: '<div class="dt-menu dropdown" close-on-click="false">\n        <a href="#" class="dropdown-toggle icon-add">\n          Configure Columns\n        </a>\n        <div class="dropdown-menu" role="menu" aria-labelledby="dropdown">\n          <div class="keywords">\n            <input type="text" \n                   click-select\n                   placeholder="Filter columns..." \n                   ng-model="columnKeyword" \n                   autofocus />\n          </div>\n          <ul>\n            <li ng-repeat="column in available | filter:columnKeyword">\n              <label class="dt-checkbox">\n                <input type="checkbox" \n                       ng-checked="dtm.isChecked(column)"\n                       ng-click="dtm.onCheck(column)">\n                {{column.name}}\n              </label>\n            </li>\n          </ul>\n        </div>\n      </div>'
    };
  }return {
    setters: [function (_angular) {
      angular = _angular['default'];
    }, function (_dropdown) {
      Dropdown = _dropdown['default'];
    }],
    execute: function () {
      DataTableMenuController = (function () {
        /*@ngInject*/

        function DataTableMenuController($scope, $timeout) {
          _classCallCheck(this, DataTableMenuController);

          this.$scope = $scope;
        }
        DataTableMenuController.$inject = ["$scope", "$timeout"];

        _createClass(DataTableMenuController, [{
          key: 'getColumnIndex',
          value: function getColumnIndex(model) {
            return this.$scope.current.findIndex(function (col) {
              return model.name == col.name;
            });
          }
        }, {
          key: 'isChecked',
          value: function isChecked(model) {
            return this.getColumnIndex(model) > -1;
          }
        }, {
          key: 'onCheck',
          value: function onCheck(model) {
            var idx = this.getColumnIndex(model);
            if (idx === -1) {
              this.$scope.current.push(model);
            } else {
              this.$scope.current.splice(idx, 1);
            }
          }
        }]);

        return DataTableMenuController;
      })();

      ;

      _export('default', angular.module('dt.menu', [Dropdown.name]).controller('DataTableMenuController', DataTableMenuController).directive('dtm', DataTableMenuDirective));
    }
  };
});