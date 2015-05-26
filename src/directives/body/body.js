import angular from 'angular';
import { requestAnimFrame } from 'utils/utils';

export class BodyController{

  constructor($scope, $timeout, throttle){
    angular.extend(this, {
      $scope: $scope,
      options: $scope.options,
      selected: $scope.selected
    });

    this.rows = [];
    this._maxVisibleRowCount = Math.ceil(
      this.options.cache.bodyHeight / this.options.rowHeight) + 1;

    this._viewportRowsStart = 0;
    this._viewportRowsEnd = 0;

    $scope.$watchCollection('values', (newVal, oldVal) => {
      if(newVal) {
        this._rowsCount = $scope.values.length;
        if(this.options.scrollbarV){
          this.getRows();
        } else {
          this.rows.splice(0, this.rows.length);
          this.rows.push(...$scope.values);
        }
      }
    });

    if(this.options.scrollbarV){
      $scope.$watch('offset', throttle(this.getRows.bind(this), 10));
    }
  }

  getRows(){
    var firstRowIndex = Math.max(Math.floor((this.$scope.offset || 0) / this.options.rowHeight, 0), 0),
        endIndex = Math.min(firstRowIndex + this._maxVisibleRowCount, this._rowsCount),
        rowIndex = firstRowIndex,
        idx = 0;

    while (rowIndex < endIndex || (this.options.cache.bodyHeight < this._viewportHeight && rowIndex < this._rowsCount)) {
      this.rows[idx++] = this.$scope.values[rowIndex];
      this._viewportRowsEnd = rowIndex++;
    }
  }

  styles(){
    var styles = {
      width: this.options.cache.innerWidth + 'px',
      height: this.options.cache.bodyHeight + 'px'
    };

    if(!this.options.scrollbarV){
      styles['overflow'] = 'hidden';
    }

    return styles;
  }

  scrollStyles(scope){
    if(scope.values){
      return {
        height: this.totalRowHeight(scope.values) + 'px'
      };
    }
  }

  innerStyles(scope){
    if(this.options.scrollbarV){
      return {
        transform: `translate3d(0px, ${scope.offset}px, 0px)`
      };
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

  getValue(idx){
    return this.rows[idx];
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
            <dt-row ng-repeat="r in body.rows track by $index" 
                    value="body.getValue($index)"
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
        });
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
