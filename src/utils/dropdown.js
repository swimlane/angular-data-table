import angular from 'angular';

class DropdownController{
  constructor($scope){
    $scope.open = false;
  }

  toggle(scope){
    scope.open = !scope.open;
  }
}

function DropdownDirective($document){
  return {
    restrict: 'C',
    controller: 'DropdownController'
  };
};

function DropdownMenuDirective($animate){
  return {
    restrict: 'C',
    require: '?^dropdown',
    link: function($scope, $elm, $attrs, ctrl) {
      $scope.$watch('open', () => {
        $animate[$scope.open ? 'addClass' : 'removeClass']($elm, 'ddm-open');
      });
    }
  };
};

function DropdownToggleDirective($timeout){
  return {
    restrict: 'C',
    controller: 'DropdownController',
    require: '?^dropdown',
    link: function($scope, $elm, $attrs, ctrl) {

      function toggleClick(event) {
        event.preventDefault();
        if (!$elm.hasClass('disabled') && !$attrs.disabled ) {
          $timeout(() => {
            ctrl.toggle($scope);
          });
        }
      };

      function toggleDestroy(){
        $elm.unbind('click', toggleClick);
      };

      $elm.bind('click', toggleClick);
      $scope.$on('$destroy', toggleDestroy);
    }
  };
};

export default angular
  .module('dt.dropdown', [])
  .controller('DropdownController', DropdownController)
  .directive('dropdown', DropdownDirective)
  .directive('dropdownToggle', DropdownToggleDirective)
  .directive('dropdownMenu', DropdownMenuDirective);
