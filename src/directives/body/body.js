import angular from 'angular';
import { requestAnimFrame, KeyCodes, ColumnsByPin } from 'utils/utils';
import { ColumnTotalWidth } from 'utils/math';

export class BodyController{

  constructor($scope, $timeout, throttle){
    angular.extend(this, {
      $scope: $scope,
      options: $scope.options,
      selected: $scope.selected
    });

    this.rows = [];
    this._viewportRowsStart = 0;
    this._viewportRowsEnd = 0;
    this._maxVisibleRowCount = Math.ceil(this.options.cache.bodyHeight / this.options.rowHeight) + 1;

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

    this.columnsByPin = ColumnsByPin($scope.options.columns);

    $scope.$watch('options.columns', (newVal) => {
      this.columnsByPin = ColumnsByPin(newVal);
    }, true);
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
      width: this.options.cache.innerWidth + 'px'
    };

    if(!this.options.scrollbarV){
      styles.overflow = 'hidden';
    } else {
      styles.height = this.options.cache.bodyHeight + 'px';
    }

    return styles;
  }

  rowStyles(scope, row){
    if(this.options.scrollbarV){
      var idx = scope.values.indexOf(row);
      return {
        transform: `translate3d(0, ${idx * scope.options.rowHeight}px, 0)`
      }
    }
  }

  rowClasses(row){
    return {
      'hover': !this.scrolling && this.hover === row,
      'selected': this.isSelected(row)
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

    return selected;
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

  stylesByGroup(scope, group){
    var styles = {
      width: ColumnTotalWidth(this.columnsByPin[group]) + 'px'
    };

    if(scope.values){
      styles.height = this.totalRowHeight(scope.values) + 'px';
    }

    return styles;
  }

  centerStyle(scope){
    return { 
      width: scope.options.cache.innerWidth - ColumnTotalWidth(this.columnsByPin.left) + 'px'
    };
  }

  rowMouseEnter(row){
    if(!this.scrolling){
      this.hover = row;
    }
  }

  rowMouseLeave(row){
    this.hover = false;
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
        <div class="dt-body-scroller">

          <div class="dt-row-left" 
               ng-if="body.columnsByPin.left.length"
               ng-style="body.stylesByGroup(this, 'left')">
            <dt-row ng-repeat="r in body.rows track by $index" 
                    value="body.getValue($index)"
                    tabindex="{{$index}}"
                    ng-keydown="body.keyDown($event, $index, r)"
                    ng-click="body.rowClicked($event, $index, r)"
                    columns="body.columnsByPin.left"
                    ng-class="body.rowClasses(r)"
                    ng-mouseenter="body.rowMouseEnter(r)"
                    ng-mouseleave="body.rowMouseLeave(r)"
                    ng-style="body.rowStyles(this, r)">
            </dt-row>
          </div>

          <div class="dt-row-center" ng-style="body.centerStyle(this)">
            <div ng-style="body.stylesByGroup(this, 'center')">
              <dt-row ng-repeat="r in body.rows track by $index" 
                      value="body.getValue($index)"
                      tabindex="{{$index}}"
                      ng-keydown="body.keyDown($event, $index, r)"
                      ng-click="body.rowClicked($event, $index, r)"
                      ng-mouseenter="body.rowMouseEnter(r)"
                      ng-mouseleave="body.rowMouseLeave(r)"
                      ng-class="body.rowClasses(r)"
                      columns="body.columnsByPin.center"
                      ng-style="body.rowStyles(this, r)">
              </dt-row>
            </div>
          </div>

          <div class="dt-row-right" 
               ng-if="body.columnsByPin.right.length"
               ng-style="body.stylesByGroup(this, 'center')">
            <dt-row ng-repeat="r in body.rows track by $index" 
                    value="body.getValue($index)"
                    tabindex="{{$index}}"
                    ng-keydown="body.keyDown($event, $index, r)"
                    ng-click="body.rowClicked($event, $index, r)"
                    ng-mouseenter="body.rowMouseEnter(r)"
                    ng-class="body.rowClasses(r)"
                    ng-mouseleave="body.rowMouseLeave(r)"
                    columns="body.columnsByPin.right"
                    ng-style="body.rowStyles(this, r)">
            </dt-row>
          </div>

        </div>
      </div>`,
    replace:true,
    link: function($scope, $elm, $attrs, ctrl){
      var ticking = false,
          lastScrollY = 0,
          lastScrollX = 0,
          timer;

      function update(){
        $timeout(() => {
          $scope.options.cache.offsetY = lastScrollY;
          $scope.options.cache.offsetX = lastScrollX;
        });

        $timeout.cancel(timer)
        timer = $timeout(() => {
          ctrl.scrolling = false;
        }, 10);

        ticking = false;
      };

      function requestTick() {
        if(!ticking) {
          requestAnimFrame(update);
          ticking = true;
        }
      };

      $elm.on('scroll', function(ev) {
        ctrl.scrolling = true;
        lastScrollY = this.scrollTop;
        requestTick();
      });

      angular.element($elm[0].querySelector('.dt-row-center'))
        .on('scroll', function() {
          lastScrollX = this.scrollLeft;
          requestTick();
        });
    }
  };
};
