import angular from 'angular';
import { requestAnimFrame } from 'utils/utils';

export class BodyController{
  constructor($scope){

    angular.extend(this, {
      options: $scope.options,
      selected: $scope.selected
    });

    // !this.options.scrollbarV

    $scope.$watchCollection('values', (n) => {
      if(n) $scope.rows = $scope.values.slice(0, this.rowsForHeight() * 2)
    })
  }

  styles(){
    return {
      width: this.options.cache.innerWidth + 'px',
      height: this.options.cache.bodyHeight + 'px'
    };
  }

  scrollStyles(scope){
    if(!scope.values) return;

    return {
      height: this.totalRowHeight(scope.values) + 'px'
    };
  }

  innerStyles(scope){
    return {
      transform: `translate3d(0px, ${scope.offset}px, 0px)`
    };
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
    };
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

  totalRowHeight(data){
    return data.length * this.options.rowHeight;
  }

  rowsForHeight(){
    return this.options.cache.bodyHeight / this.options.rowHeight;
  }
}

export var BodyDirective = function($timeout){
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
        <div class="dt-body-scroller" ng-style="body.scrollStyles(this)">
          <div class="dt-body-inner" ng-style="body.innerStyles(this)">
            <dt-row ng-repeat="r in rows track by $index" 
                    value="r"
                    ng-click="body.rowClicked(r)"
                    options="options"
                    ng-class="body.isSelected(r)">
            </dt-row>
          </div>
        </div>
      </div>`,
    replace:true,
    link: function($scope, $elm, $attrs){

      var ticking = false;
      var lastScrollY = 0;

      function update(){
        $timeout(() => {
          $scope.offset = lastScrollY;
        })
        ticking = false;
      };

      function requestTick() {
        if(!ticking) {
          requestAnimFrame(update);
          ticking = true;
        }
      };

      function onScroll(ev){
        lastScrollY = this.scrollTop;
        requestTick();
      };

      $elm[0].addEventListener('scroll', onScroll, false);
    }
  };
};
