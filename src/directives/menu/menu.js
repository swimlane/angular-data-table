import angular from 'angular';
import Dropdown from 'utils/dropdown';
 
class DataTableMenuController{
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

function DataTableMenuDirective(){
  return {
    restrict: 'E',
    controller: 'DataTableMenuController',
    controllerAs: 'dtm',
    scope: {
      current: '=',
      available: '='
    },
    template: 
      `<div class="dt-menu dropdown" close-on-click="false">
        <a href="#" class="dropdown-toggle icon-add">
          Configure Columns
        </a>
        <div class="dropdown-menu" role="menu" aria-labelledby="dropdown">
          <div class="keywords">
            <input type="text" 
                   click-select
                   placeholder="Filter columns..." 
                   ng-model="columnKeyword" 
                   autofocus />
          </div>
          <ul>
            <li ng-repeat="column in available | filter:columnKeyword">
              <label class="dt-checkbox">
                <input type="checkbox" 
                       ng-checked="dtm.isChecked(column)"
                       ng-click="dtm.onCheck(column)">
                {{column.name}}
              </label>
            </li>
          </ul>
        </div>
      </div>`
  };
};

export default angular
  .module('dt.menu', [ Dropdown.name ])
  .controller('DataTableMenuController', DataTableMenuController)
  .directive('dtm', DataTableMenuDirective);
