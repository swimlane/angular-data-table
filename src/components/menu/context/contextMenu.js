import angular from 'angular';
import dropdown from '../dropdown/dropdown';

export default angular
  .module('contextmenu', [ dropdown.name ])
  .directive('contextMenu', ContextMenuDirective)
