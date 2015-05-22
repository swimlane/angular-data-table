import angular from 'angular';

export class BodyController{
  constructor($scope){

    angular.extend(this, {
      data: $scope.values,
      options: $scope.options,
      selected: $scope.selected
    });
  }

  styles(){
    return {
      width: this.options.cache.innerWidth + 'px',
      height: this.options.cache.bodyHeight + 'px'
    };
  }

  limit(){
    if(!this.options.scrollbarV){
      return this.data.length;
    } else {
      // todo
      return 100;
    }
  }

  isSelected(row){
    var selected = false;

    if(this.options.selectable){
      if(this.options.multiSelect){
        selected = this.selected.indexOf(row) > -1;
      } else {
        selected = this.selected === row;
      }
    }

    return {
      'selected': selected
    }
  }

  rowClicked(row){
    if(this.options.selectable){
      if(this.options.multiSelect){
        var idx = this.selected.indexOf(row);
        if(idx > -1){
          this.selected.splice(idx, 1);
        } else {
          this.selected.push(row);
        }
      } else {
        this.selected = row;
      }
    }
  }
}

export var BodyDirective = function(){
  return {
    restrict: 'E',
    controller: 'BodyController',
    controllerAs: 'body',
    scope: {
      values: '=',
      options: '=',
      selected: '='
    },
    template: `
      <div class="dt-body" ng-style="body.styles()">
        <dt-row ng-repeat="r in values track by $index | limitTo: body.limit()" 
                value="r"
                ng-click="body.rowClicked(r)"
                options="options"
                ng-class="body.isSelected(r)">
        </dt-row>
      </div>`,
    replace:true
  };
};
