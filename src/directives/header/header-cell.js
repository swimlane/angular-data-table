import angular from 'angular';
 
export class HeaderCellController{
  constructor($scope){
    this.col = $scope.column;
  }

  styles(){
    return {
      width: this.col.width  + 'px',
      minWidth: this.col.minWidth  + 'px',
      maxWidth: this.col.maxWidth  + 'px',
      height: this.col.height  + 'px'
    };
  }

  cellClass(){
    var cls = {
      'sortable': this.col.sortable,
      'dt-header-cell': true
    };

    if(this.col.cssClass){
      cls[this.col.cssClass] = true;
    }

    return cls;
  }

  sort(){
    if(this.col.sortable){
      if(!this.col.sort){
        this.col.sort = 'asc';
      } else if(this.col.sort === 'asc'){
        this.col.sort = 'desc';
      } else if(this.col.sort === 'desc'){
        this.col.sort = undefined;
      }
    }
  }

  sortClass(){
    return {
      'sort-btn': true,
      'sort-asc icon-down': this.col.sort === 'asc',
      'sort-desc icon-up': this.col.sort === 'desc'
    };
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
      `<div ng-class="hcell.cellClass()"
            ng-click="hcell.sort()"
            ng-style="hcell.styles()">
        <span class="dt-header-cell-label">
          {{::column.name}}
        </span>
        <span ng-class="hcell.sortClass()"></span>
      </div>`
  };
};
