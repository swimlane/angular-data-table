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
      'selectable': this.col.selectable,
      'highlight': this.col.selected,
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

  selectCol(){
    this.col.selected = !this.col.selected;
  }

  sortClass(){
    return {
      'sort-btn': true,
      'sort-asc icon-down': this.col.sort === 'asc',
      'sort-desc icon-up': this.col.sort === 'desc'
    };
  }
}

export var HeaderCellDirective = function($timeout){
  return {
    restrict: 'E',
    controller: 'HeaderCellController',
    controllerAs: 'hcell',
    scope: {
      column: '='
    },
    template: 
      `<div ng-class="hcell.cellClass()"
            ng-click="hcell.sort()"
            ng-dblclick="hcell.selectCol()"
            ng-style="hcell.styles()">
        <span class="dt-header-cell-label">
          {{::column.name}}
        </span>
        <span ng-class="hcell.sortClass()"></span>
      </div>`
  };
};
