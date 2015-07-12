export class DropdownController{
  /*@ngInject*/
  constructor($scope){
    $scope.open = false;
  }

  toggle(scope){
    scope.open = !scope.open;
  }
}
