import angular from 'angular';

export class RowController {

  getValue(scope, col){
    return scope.value[col.prop];
  }

}

export function RowDirective(){

  return {
    restrict: 'E',
    controller: 'RowController',
    controllerAs: 'row',
    replace: true,
    scope: {
      columns: '=',
      value: '='
    },
    template: `
      <div class="dt-row">
          <dt-cell ng-repeat="column in columns track by $index"
                   column="column" 
                   value="row.getValue(this, column)">
          </dt-header-cell>
      </div>`,
    replace:true
  };
};
