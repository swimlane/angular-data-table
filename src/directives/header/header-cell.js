import angular from 'angular';
import { Resizable } from 'utils/resizable';
 
export class HeaderCellController{

  styles(scope){
    return {
      width: scope.column.width  + 'px',
      minWidth: scope.column.minWidth  + 'px',
      maxWidth: scope.column.maxWidth  + 'px',
      height: scope.column.height  + 'px'
    };
  }

  cellClass(scope){
    var cls = {
      'sortable': scope.column.sortable,
      'dt-header-cell': true,
      'resizable': scope.column.resizable
    };

    if(scope.column.cssClass){
      cls[scope.column.cssClass] = true;
    }

    return cls;
  }

  sort(scope){
    if(scope.column.sortable){
      if(!scope.column.sort){
        scope.column.sort = 'asc';
      } else if(scope.column.sort === 'asc'){
        scope.column.sort = 'desc';
      } else if(scope.column.sort === 'desc'){
        scope.column.sort = undefined;
      }
    }
  }

  sortClass(scope){
    return {
      'sort-btn': true,
      'sort-asc icon-down': scope.column.sort === 'asc',
      'sort-desc icon-up': scope.column.sort === 'desc'
    };
  }

  resized(width, column){
    column.width = width;
  }

}

export function HeaderCellDirective($timeout){
  return {
    restrict: 'E',
    controller: 'HeaderCellController',
    controllerAs: 'hcell',
    scope: {
      column: '='
    },
    replace: true,
    template: 
      `<div ng-class="hcell.cellClass(this)"
            ng-style="hcell.styles(this)">
        <div resizable="column.resizable" 
             on-resize="hcell.resized(width, column)">
          <span class="dt-header-cell-label" 
              ng-click="hcell.sort(this)">
            {{::column.name}}
          </span>
          <span ng-class="hcell.sortClass(this)"></span>
        </div>
      </div>`
  };
};
