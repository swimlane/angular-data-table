export class MenuController{

  /*@ngInject*/
  constructor($scope, $timeout){
    this.$scope = $scope;
  }

  getColumnIndex(model){
    return this.$scope.current.findIndex((col) => {
      return model.name == col.name;
    });
  }

  isChecked(model){
    return this.getColumnIndex(model) > -1;
  }

  onCheck(model){
    var idx = this.getColumnIndex(model);
    if(idx === -1){
      this.$scope.current.push(model);
    } else {
      this.$scope.current.splice(idx, 1);
    }
  }
  
}
