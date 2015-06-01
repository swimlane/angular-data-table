import angular from 'angular';
import { DeepValueGetter } from 'utils/utils';

export class RowController {

  getValue(scope, col){
    return DeepValueGetter(scope.value, col.prop);
  }

  onTreeToggle(scope, cell){
    scope.onTreeToggle({ 
      cell: cell,
      row: scope.value
    });
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
      value: '=',
      expanded: '=',
      hasChildren: '=',
      onTreeToggle: '&'
    },
    template: `
      <div class="dt-row">
          <dt-cell ng-repeat="column in columns track by $index"
                   on-tree-toggle="row.onTreeToggle(this, cell)"
                   column="column" 
                   has-children="hasChildren"
                   expanded="expanded"
                   value="row.getValue(this, column)">
          </dt-header-cell>
      </div>`,
    replace:true
  };
};
