import angular from 'angular';
import { PopoverDirective } from './directive';
import { PopoverRegistry } from './registry';
import { PositionHelper } from './position';

export default angular
  .module('popover', [])
  .service('PopoverRegistry', PopoverRegistry)
  .factory('PositionHelper', PositionHelper)
  .directive('swPopover', PopoverDirective);
