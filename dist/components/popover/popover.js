System.register(['angular', './directive', './registry', './position'], function (_export) {
  'use strict';

  var angular, PopoverDirective, PopoverRegistry, PositionHelper;
  return {
    setters: [function (_angular) {
      angular = _angular['default'];
    }, function (_directive) {
      PopoverDirective = _directive.PopoverDirective;
    }, function (_registry) {
      PopoverRegistry = _registry.PopoverRegistry;
    }, function (_position) {
      PositionHelper = _position.PositionHelper;
    }],
    execute: function () {
      _export('default', angular.module('popover', []).service('PopoverRegistry', PopoverRegistry).factory('PositionHelper', PositionHelper).directive('swPopover', PopoverDirective));
    }
  };
});