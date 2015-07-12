export function DropdownDirective($document, $timeout){
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
