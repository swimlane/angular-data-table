import angular from 'angular';
import { requestAnimFrame, KeyCodes } from 'utils/utils';

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
      $scope.$watch('options.cache.offsetY', throttle(this.getRows.bind(this), 10));
    }
  }

  getRows(){
    var firstRowIndex = Math.max(Math.floor((this.$scope.options.cache.offsetY || 0) / this.options.rowHeight, 0), 0),
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

  rowStyles(scope, row){
    if(this.options.scrollbarV){
      var idx = scope.values.indexOf(row);
      return {
        transform: `translate3d(0, ${idx * scope.options.rowHeight}px, 0)`
      }
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

  keyDown(ev, index, row){
    ev.preventDefault();

    if (ev.keyCode === KeyCodes.DOWNARROW) {
      var next = ev.target.nextElementSibling;
      if(next){
        next.focus();
      }
    } else if (ev.keyCode === KeyCodes.UPARROW) {
      var prev = ev.target.previousElementSibling;
      if(prev){
        prev.focus();
      }
    } else if(ev.keyCode === KeyCodes.ENTER){
      this.selectRow(index, row);
    }
  }

  rowClicked(event, index, row){
    event.preventDefault();
    this.selectRow(index, row);
    
    if(this.$scope.onSelect){
      this.$scope.onSelect({ row: row });
    }
  }

  selectRow(index, row){
    if(this.options.selectable){
      if(this.options.multiSelect){
        var isCtrlKeyDown = event.ctrlKey || event.metaKey,
            isShiftKeyDown = event.shiftKey;

        if(isShiftKeyDown){
          this.selectRowsBetween(index, row);
        } else {
          var idx = this.selected.indexOf(row);
          if(idx > -1){
            this.selected.splice(idx, 1);
          } else {
            this.selected.push(row);
          }
        }
        this.prevIndex = index;
      } else {
        this.selected = row;
      }
    }
  }

  selectRowsBetween(index){
    this.rows.forEach((row, i) => {
      if(i >= this.prevIndex && i <= index){
        var idx = this.selected.indexOf(row);
        if(idx === -1){
          this.selected.push(row);
        }
      }
    });
  }

  totalRowHeight(data){
    return data.length * this.options.rowHeight;
  }

  getValue(idx){
    return this.rows[idx];
  }
}

export function BodyDirective($timeout){
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
          <dt-row ng-repeat="r in body.rows track by $index" 
                  value="body.getValue($index)"
                  tabindex="{{$index}}"
                  ng-keydown="body.keyDown($event, $index, r)"
                  ng-click="body.rowClicked($event, $index, r)"
                  options="options"
                  ng-style="body.rowStyles(this, r)"
                  ng-class="body.isSelected(r)">
          </dt-row>
        </div>
      </div>`,
    replace:true,
    link: function($scope, $elm, $attrs){

      var ticking = false,
          lastScrollY = 0,
          lastScrollX = 0;

      function update(){
        $timeout(() => {
          $scope.options.cache.offsetY = lastScrollY;
          $scope.options.cache.offsetX = lastScrollX;
        });
        ticking = false;
      };

      function requestTick() {
        if(!ticking) {
          requestAnimFrame(update);
          ticking = true;
        }
      };

      $elm.on('scroll', function(ev) {
        lastScrollY = this.scrollTop;
        lastScrollX = this.scrollLeft;
        requestTick();
      });
    }
  };
};
