System.register(['angular', './dropdown'], function (_export) {
  'use strict';

  var angular, Dropdown, ContextMenuController;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function ContextMenuDirective() {
    return {
      restrict: 'C',
      controller: 'ContextMenuController',
      link: function link($scope, $elm, $attrs, ctrl) {}
    };
  }

  return {
    setters: [function (_angular) {
      angular = _angular['default'];
    }, function (_dropdown) {
      Dropdown = _dropdown['default'];
    }],
    execute: function () {
      ContextMenuController = function ContextMenuController() {
        _classCallCheck(this, ContextMenuController);
      };

      _export('default', angular.module('contextmenu', [Dropdown.name]).directive('contextMenu', ContextMenuDirective));
    }
  };
});