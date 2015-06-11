import angular from 'angular';

class DropdownController{
  /*@ngInject*/
  constructor($scope){
    $scope.open = false;
  }

  toggle(scope){
    scope.open = !scope.open;
  }
}

function DropdownDirective($document, $timeout){
  return {
    restrict: 'C',
    controller: 'DropdownController',
    link: function($scope, $elm, $attrs) {

      function closeDropdown(ev){
        if($elm[0].contains(ev.target) ) {
          return;
        }

        $timeout(() => {
          $scope.open = false;
          off();
        });
      };

      function keydown(ev){
        if (ev.which === 27) {
          $timeout(() => {
            $scope.open = false;
            off();
          });
        }
      };

      function off(){
        $document.unbind('click', closeDropdown);
        $document.unbind('keydown', keydown);
      };

      $scope.$watch('open', (newVal) => {
        if(newVal){
          $document.bind('click', closeDropdown);
          $document.bind('keydown', keydown);
        }
      });
      
    }
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
        $timeout(() => {
          ctrl.toggle($scope);
        });
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
