import angular from 'angular';
import { Resizable } from 'utils/resizable';
 
// https://github.com/angular-ui/bootstrap/blob/master/src/dropdown/dropdown.js
// http://ui.lumapps.com/directives/dropdowns
// http://getbootstrap.com/components/#dropdowns
export class DropdownController{

}

export function DropdownDirective(){
  return {
    restrict: 'E',
    controllerAs: 'dd',
    link: function($scope, $elm, $attrs) {

    }
  };
};
