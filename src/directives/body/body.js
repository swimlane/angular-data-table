import angular from 'angular';
import { requestAnimFrame, KeyCodes, ColumnsByPin } from 'utils/utils';
import { ColumnTotalWidth } from 'utils/math';

export class BodyController{

  /**
   * A tale body controller
   * @param  {$scope}
   * @param  {$timeout}
   * @param  {throttle}
   * @return {BodyController}
   */
  constructor($scope, $timeout, throttle){
    angular.extend(this, {
      $scope: $scope,
      options: $scope.options,
      selected: $scope.selected
    });

    this.rows = [];
    this._viewportRowsStart = 0;
    this._viewportRowsEnd = 0;
    this.columnsByPin = ColumnsByPin($scope.options.columns);

    if(this.options.scrollbarV){
      $scope.$watch('options.internal.offsetY', throttle(this.getRows.bind(this), 10));
    }

    $scope.$watch('options.columns', (newVal) => {
      this.groupColumn = newVal.find((c) => {
        return c.isTreeColumn;
      });

      this.columnsByPin = ColumnsByPin(newVal);
    }, true);

    $scope.$watchCollection('values', (newVal, oldVal) => {
      if(newVal) {
        if(!this.options.paging.externalPaging){
          this.options.paging.count = newVal.length;
        }

        if(this.groupColumn){
		      this.buildIndexes();
          this.rowsByGroup = this.getRowsByGroup();
        }

        if(this.options.scrollbarV){
          this.getRows();
        } else {
          this.rows.splice(0, this.rows.length);
          this.rows.push(...$scope.values);
        }
      }
    });

    if(this.options.scrollbarV){
      $scope.$watch('options.internal.offsetY', (newVal) => {
        this.updatePage();
      });

      $scope.$watch('options.paging.offset', (newVal) => {
        $scope.onPage({
          offset: newVal,
          size: this.options.paging.size
        });
      });
    }
  }

  /**
   * Gets the first and last indexes based on the offset, row height, page size, and overall count.
   * @return {object}
   */
  getFirstLastIndexes(){
    var firstRowIndex = Math.max(Math.floor((
          this.$scope.options.internal.offsetY || 0) / this.options.rowHeight, 0), 0),
        endIndex = Math.min(firstRowIndex + this.options.paging.size, this.options.paging.count);

    return {
      first: firstRowIndex,
      last: endIndex
    };
  }

  /**
   * Updates the page's offset given the scroll position.
   * @param  {paging object}
   */
  updatePage(){
    var idxs = this.getFirstLastIndexes(),
        curPage = Math.ceil(idxs.first / this.options.paging.size);
        //console.log(curPage)
    this.options.paging.offset = curPage;
  }

  /**
   * Matches groups to their respective parents by index.
   * 
   * Example:
   * 
   *  {
   *    "Acme" : [
   *      { name: "Acme Holdings", parent: "Acme" }
   *    ],
   *    "Acme Holdings": [
   *      { name: "Acme Ltd", parent: "Acme Holdings" }
   *    ]
   *  }
   * 
   */
  getRowsByGroup(){
    var obj = {};

    this.$scope.values.forEach((val) => {
      var relVal = val[this.groupColumn.relationProp];
      if(relVal){
        if(obj[relVal]){
          obj[relVal].push(val);
        } else {
          obj[relVal] = [ val ];
        }
      }
    });

    return obj;
  }

  /**
   * Creates an index on the treeColumn if there is one
   * and assigns depths to all rows.
   * 
   * TODO: move to `getRowsByGroup` so we can minimize 
   *       itterations over total collection
   */
  buildIndexes(){
    var prop = this.groupColumn.prop, 
        parentProp = this.groupColumn.relationProp;

    this.index = {};

    this.$scope.values.forEach((obj) => {
      this.index[obj[prop]] = obj;
      if (obj[parentProp] === undefined){
        obj.$$depth = 0;
      } else {
        var parent = this.index[obj[parentProp]];
        obj.$$depth = parent.$$depth + 1;
        if (parent.$$children){
          parent.$$children.push(obj[prop]);
        } else {
          parent.$$children = [obj[prop]];
        }
      }
    })
  }

  /**
   * Creates the intermediate collection that is shown in the view.
   */
  getRows(){
    var indexes = this.getFirstLastIndexes(),
        temp = this.$scope.values || [];

    // determine the child rows to show if grouping
    if(this.groupColumn){
      var idx = 0,
          rowIndex = indexes.first,
          last = indexes.last;
      temp = [];

      while(rowIndex < last && last <= this.options.paging.count){
        var row = this.$scope.values[rowIndex],
            relVal = row[this.groupColumn.relationProp],
            keyVal = row[this.groupColumn.prop],
            rows = this.rowsByGroup[keyVal],
            expanded = this.$scope.expanded[keyVal];

        if(!relVal){
          temp[idx++] = row;
        }

        if(rows && rows.length){
          if(expanded){
            rows.forEach((r) => {
              temp[idx++] = r;
            });
          } else {
            last = last + 1 >= this.options.paging.count ? last : last + 1;
          }
        }

        rowIndex++;
      }

      // Have to splice out the list to force
      // the list to update if we collapse
      // and have less rows than expanded
      this.rows.splice(0, this.rows.length);
    }

    var rowIndex = indexes.first,
        idx = 0;

    while (rowIndex < indexes.last || (this.options.internal.bodyHeight <
        this._viewportHeight && rowIndex < this.options.paging.count)) {
      var row = temp[rowIndex];
      if(row){
        row.$$index = rowIndex;
        this.rows[idx] = row;
      }
      idx++;
      this._viewportRowsEnd = rowIndex++;
    }
  }

  /**
   * Returns the styles for the table body directive.
   * @return {[object]}
   */
  styles(){
    var styles = {
      width: this.options.internal.innerWidth + 'px'
    };

    if(!this.options.scrollbarV){
      styles.overflow = 'hidden';
    } else {
      styles.height = this.options.internal.bodyHeight + 'px';
    }

    return styles;
  }

  /**
   * Returns the styles for the row diretive.
   * @param  {scope}
   * @param  {row}
   * @return {styles object}
   */
  rowStyles(scope, row){
    if(this.options.scrollbarV){
      return {
        transform: `translate3d(0, ${row.$$index * scope.options.rowHeight}px, 0)`
      }
    }
  }

  /**
   * Returns the css classes for the row directive.
   * @param  {scope}
   * @param  {row}
   * @return {css class object}
   */
  rowClasses(scope, row){
    var styles = {
      'hover': !this.scrolling && this.hover === row,
      'selected': this.isSelected(row)
    };

    if(this.groupColumn){
      // if i am a child
      styles['dt-leaf'] = this.rowsByGroup[row[this.groupColumn.relationProp]];
      // if i have children
      styles['dt-has-leafs'] = this.rowsByGroup[row[this.groupColumn.prop]];
      // the depth
      styles['dt-depth-' + row.$$depth] = true;
    }

    return styles;
  }

  /**
   * Returns if the row is selected
   * @param  {row}
   * @return {Boolean}
   */
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

  /**
   * Handler for the keydown on a row
   * @param  {event}
   * @param  {index}
   * @param  {row}
   */
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

  /**
   * Handler for the row click event
   * @param  {event}
   * @param  {index}
   * @param  {row}
   */
  rowClicked(event, index, row){
    event.preventDefault();
    this.selectRow(index, row);

    if(this.$scope.onSelect){
      this.$scope.onSelect({ row: row });
    }
  }

  /**
   * Selects a row and places in the selection collection
   * @param  {index}
   * @param  {row}
   */
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

  /**
   * Selectes the rows between a index.  Used for shift click selection.
   * @param  {index}
   */
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

  /**
   * Returns the virtual row height.
   * @return {[type]}
   */
  totalRowsHeight(){
    return this.options.paging.count * this.options.rowHeight;
  }

  /**
   * Returns the row model for the index in the view.
   * @param  {index}
   * @return {row model}
   */
  getRowValue(idx){
    return this.rows[idx];
  }

  /**
   * Calculates the styles for a pin group
   * @param  {scope}
   * @param  {group}
   * @return {styles object}
   */
  stylesByGroup(scope, group){
    return {
      width: ColumnTotalWidth(this.columnsByPin[group]) + 'px',
      height: this.totalRowsHeight() + 'px'
    };
  }

  /**
   * Calculates the styles for the center group
   * @param  {scope}
   * @return {styles object}
   */
  centerStyle(scope){
    return {
      width: scope.options.internal.innerWidth - ColumnTotalWidth(this.columnsByPin.left) + 'px'
    };
  }

  /**
   * Mouse enter handler on a row.
   * @param  {row}
   */
  rowMouseEnter(row){
    if(!this.scrolling){
      this.hover = row;
    }
  }

  /**
   * Mouse leave handler on a row
   * @param  {row}
   */
  rowMouseLeave(row){
    this.hover = false;
  }

  /**
   * Calculates if a row is expanded or collasped for tree grids.
   * @param  {scope}
   * @param  {row}
   * @return {boolean}
   */
  getRowExpanded(scope, row){
    if(!this.groupColumn) return;
    return scope.expanded[row[this.groupColumn.prop]];
  }

  /**
   * Calculates if the row has children
   * @param  {row}
   * @return {boolean}
   */
  getRowHasChildren(row){
    if(!this.groupColumn) return;
    var children = this.rowsByGroup[row[this.groupColumn.prop]];
    return children !== undefined || (children && !children.length);
  }

  /**
   * Tree toggle event from a cell
   * @param  {scope}
   * @param  {row model}
   * @param  {cell model}
   */
  onTreeToggle(scope, row, cell){
    var val  = row[this.groupColumn.prop];
    scope.expanded[val] = !scope.expanded[val];
    this.getRows();

    scope.onTreeToggle({
      row: row,
      cell: cell
    });
  }
}

export var BodyHelper = function(){
  var _elm;
  return {
    create: function(elm){
      _elm = elm;
    },
    setYOffset: function(offsetY){
      _elm[0].scrollTop = offsetY;
    }
  }
}();

export function BodyDirective($timeout){
  return {
    restrict: 'E',
    controller: 'BodyController',
    controllerAs: 'body',
    scope: {
      values: '=',
      options: '=',
      selected: '=',
      expanded: '=',
      onPage: '&',
      onTreeToggle: '&'
    },
    template: `
      <div class="dt-body" ng-style="body.styles()">
        <div class="dt-body-scroller">

          <div class="dt-row-left"
               ng-if="body.columnsByPin.left.length"
               ng-style="body.stylesByGroup(this, 'left')">
            <dt-row ng-repeat="r in body.rows track by $index"
                    value="body.getRowValue($index)"
                    tabindex="{{$index}}"
                    ng-keydown="body.keyDown($event, $index, r)"
                    ng-click="body.rowClicked($event, $index, r)"
                    ng-class="body.rowClasses(this, r)"
                    ng-mouseenter="body.rowMouseEnter(r)"
                    ng-mouseleave="body.rowMouseLeave(r)"
                    ng-style="body.rowStyles(this, r)"
                    columns="body.columnsByPin.left"
                    has-children="body.getRowHasChildren(r)"
                    expanded="body.getRowExpanded(this, r)"
                    on-tree-toggle="body.onTreeToggle(this, row, cell)">
            </dt-row>
          </div>

          <div class="dt-row-center" ng-style="body.centerStyle(this)">
            <div ng-style="body.stylesByGroup(this, 'center')">
              <dt-row ng-repeat="r in body.rows track by $index"
                      value="body.getRowValue($index)"
                      tabindex="{{$index}}"
                      ng-keydown="body.keyDown($event, $index, r)"
                      ng-click="body.rowClicked($event, $index, r)"
                      ng-mouseenter="body.rowMouseEnter(r)"
                      on-tree-toggle="body.onTreeToggle(this, row, cell)"
                      ng-mouseleave="body.rowMouseLeave(r)"
                      ng-class="body.rowClasses(this, r)"
                      columns="body.columnsByPin.center"
                      has-children="body.getRowHasChildren(r)"
                      expanded="body.getRowExpanded(this, r)"
                      ng-style="body.rowStyles(this, r)">
              </dt-row>
            </div>
          </div>

          <div class="dt-row-right"
               ng-if="body.columnsByPin.right.length"
               ng-style="body.stylesByGroup(this, 'center')">
            <dt-row ng-repeat="r in body.rows track by $index"
                    value="body.getRowValue($index)"
                    tabindex="{{$index}}"
                    ng-keydown="body.keyDown($event, $index, r)"
                    ng-click="body.rowClicked($event, $index, r)"
                    ng-mouseenter="body.rowMouseEnter(r)"
                    on-tree-toggle="body.onTreeToggle(this, cell)"
                    ng-class="body.rowClasses(this, r)"
                    ng-mouseleave="body.rowMouseLeave(r)"
                    columns="body.columnsByPin.right"
                    children="body.getRowHasChildren(r)"
                    expanded="body.getRowExpanded(this, r)"
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
          helper = BodyHelper.create($elm),
          timer;

      function update(){
        $timeout(() => {
          $scope.options.internal.offsetY = lastScrollY;
          $scope.options.internal.offsetX = lastScrollX;
          ctrl.updatePage();
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
