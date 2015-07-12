export function DropdownMenuDirective($animate){
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
