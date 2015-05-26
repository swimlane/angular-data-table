import angular from 'angular';

export class CellController {

  styles(col){
    return {
      width: col.width  + 'px',
      height: col.height  + 'px'
    };
  }

};

export function CellDirective(){
  return {
    restrict: 'E',
    controller: 'CellController',
    controllerAs: 'cell',
    scope: {
      value: '=',
      column: '='
    },
    template: 
      `<div class="dt-cell" 
            data-title="{{::column.name}}" 
            ng-style="cell.styles(column)">
        {{value}}
      </div>`
  };
};
