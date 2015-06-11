System.register(['angular'], function (_export) {
  'use strict';

  var angular, GroupRowController;

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  _export('GroupRowDirective', GroupRowDirective);

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function GroupRowDirective() {
    return {
      restrict: 'E',
      controller: 'GroupRowController',
      controllerAs: 'group',
      scope: {
        value: '=',
        onGroupToggle: '&',
        expanded: '='
      },
      replace: true,
      template: '\n      <div class="dt-group-row">\n        <span ng-class="group.treeClass(this)"\n              ng-click="group.onGroupToggle($event, this)">\n        </span>\n        <span class="dt-group-row-label">\n          {{value.name}}\n        </span>\n      </div>'
    };
  }

  return {
    setters: [function (_angular) {
      angular = _angular['default'];
    }],
    execute: function () {
      GroupRowController = (function () {
        function GroupRowController() {
          _classCallCheck(this, GroupRowController);
        }

        _createClass(GroupRowController, [{
          key: 'onGroupToggle',
          value: function onGroupToggle(evt, scope) {
            evt.stopPropagation();
            scope.onGroupToggle({
              group: scope.value
            });
          }
        }, {
          key: 'treeClass',
          value: function treeClass(scope) {
            return {
              'dt-tree-toggle': true,
              'icon-right': !scope.expanded,
              'icon-down': scope.expanded
            };
          }
        }]);

        return GroupRowController;
      })();

      _export('GroupRowController', GroupRowController);

      ;
    }
  };
});