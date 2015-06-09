import angular from 'angular';
import Dropdown from './dropdown';

class ContextMenuController{
  
}

function ContextMenuDirective(){
  return {
    restrict: 'C',
    controller: 'ContextMenuController',
    link: function($scope, $elm, $attrs, ctrl) {
    }
  }
}

export default angular
  .module('contextmenu', [ Dropdown.name ])
  .directive('contextMenu', ContextMenuDirective)
