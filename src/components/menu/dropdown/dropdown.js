import angular from 'angular';
import { DropdownController } from './DropdownController';
import { DropdownDirective } from './DropdownDirective';
import { DropdownToggleDirective } from './DropdownToggleDirective';
import { DropdownMenuDirective } from './DropdownMenuDirective';

export default angular
  .module('dt.dropdown', [])
  .controller('DropdownController', DropdownController)
  .directive('dropdown', DropdownDirective)
  .directive('dropdownToggle', DropdownToggleDirective)
  .directive('dropdownMenu', DropdownMenuDirective);
