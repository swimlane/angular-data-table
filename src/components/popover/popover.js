import angular from 'angular';
import { PopoverDirective } from './PopoverDirective';
import { PopoverRegistry } from './PopoverRegistry';
import { PositionHelper } from './PositionHelper';

export default angular
  .module('popover', [])
  .service('PopoverRegistry', PopoverRegistry)
  .factory('PositionHelper', PositionHelper)
  .directive('popover', PopoverDirective);
