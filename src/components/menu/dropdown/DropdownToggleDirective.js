export function DropdownToggleDirective($timeout){
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
