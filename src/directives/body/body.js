import angular from 'angular';
import { requestAnimFrame, ColumnsByPin } from 'utils/utils';
import { KEYS } from 'utils/keys';

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

    this.treeColumn = $scope.options.columns.find((c) => {
      return c.isTreeColumn;
    });

    this.groupColumn = $scope.options.columns.find((c) => {
      return c.group;
    });

    if(this.options.scrollbarV){
      $scope.$watch('options.internal.offsetY', throttle(this.getRows.bind(this), 10));
    }

    $scope.$watchCollection('values', (newVal, oldVal) => {
      if(newVal) {
        if(!this.options.paging.externalPaging){
          this.options.paging.count = newVal.length;
        }

        if(this.treeColumn || this.groupColumn){
		      this.buildRowsByGroup();
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
      $scope.$watch('options.internal.offsetY', this.updatePage.bind(this));
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
  buildRowsByGroup(){

    this.index = {};
    this.rowsByGroup = {};

    var parentProp = this.treeColumn ? 
      this.treeColumn.relationProp : 
      this.groupColumn.prop;

    this.$scope.values.forEach((row) => {

      // build groups
      var relVal = row[parentProp];
      if(relVal){
        if(this.rowsByGroup[relVal]){
          this.rowsByGroup[relVal].push(row);
        } else {
          this.rowsByGroup[relVal] = [ row ];
        }
      }

      // build indexes
      if(this.treeColumn){
        var prop = this.treeColumn.prop;
        this.index[row[prop]] = row;

        if (row[parentProp] === undefined){
          row.$$depth = 0;
        } else {
          var parent = this.index[row[parentProp]];
          row.$$depth = parent.$$depth + 1;
          if (parent.$$children){
            parent.$$children.push(row[prop]);
          } else {
            parent.$$children = [row[prop]];
          }
        }
      }
    });
  }

  /**
   * Creates the intermediate collection that is shown in the view.
   */
  getRows(){
    var indexes = this.getFirstLastIndexes(),
        temp = this.$scope.values || [];

    // determine the child rows to show if grouping
    if(this.treeColumn) {
      var idx = 0,
          rowIndex = indexes.first,
          last = indexes.last;
      temp = [];

      while(rowIndex < last && last <= this.options.paging.count){
        var row = this.$scope.values[rowIndex],
            relVal = row[this.treeColumn.relationProp],
            keyVal = row[this.treeColumn.prop],
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

    } else if(this.groupColumn) {
      temp = [];

      angular.forEach(this.rowsByGroup, (v, k) => {
        temp.push({
          name: k,
          group: true
        });

        if(this.$scope.expanded[k]){
          temp.push(...v);
        }
      });

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
      styles.overflowY = 'hidden';
    } else if(this.options.scrollbarH === false){
      styles.overflowX = 'hidden';
    }

    if(this.options.scrollbarV){
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
    var styles = {
      height: scope.options.rowHeight + 'px'
    };

    if(scope.options.scrollbarV){
      styles.transform = `translate3d(0, ${row.$$index * scope.options.rowHeight}px, 0)`;
    }

    return styles;
  }

  groupRowStyles(scope, row){
    var styles = this.rowStyles(scope, row);
    styles.width = scope.columnWidths.total + 'px';
    return styles;
  }

  /**
   * Returns the css classes for the row directive.
   * @param  {scope}
   * @param  {row}
   * @return {css class object}
   */
  rowClasses(scope, row){
    var styles = {
      'selected': this.isSelected(row)
    };

    if(this.treeColumn){
      // if i am a child
      styles['dt-leaf'] = this.rowsByGroup[row[this.treeColumn.relationProp]];
      // if i have children
      styles['dt-has-leafs'] = this.rowsByGroup[row[this.treeColumn.prop]];
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

    if (ev.keyCode === KEYS.DOWN) {
      var next = ev.target.nextElementSibling;
      if(next){
        next.focus();
      }
    } else if (ev.keyCode === KEYS.UP) {
      var prev = ev.target.previousElementSibling;
      if(prev){
        prev.focus();
      }
    } else if(ev.keyCode === KEYS.RETURN){
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
    if(!this.options.checkboxSelection){
      event.preventDefault();
      
      this.selectRow(index, row);

      if(this.$scope.onSelect){
        this.$scope.onSelect({ row: row });
      }
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
   * @return {[height]}
   */
  scrollerStyles(){
    return {
      height: this.options.paging.count * this.options.rowHeight + 'px'
    }
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
   * Calculates if a row is expanded or collasped for tree grids.
   * @param  {scope}
   * @param  {row}
   * @return {boolean}
   */
  getRowExpanded(scope, row){
    if(this.treeColumn) {
      return scope.expanded[row[this.treeColumn.prop]];
    } else if(this.groupColumn){
      return scope.expanded[row.name];
    }
  }

  /**
   * Calculates if the row has children
   * @param  {row}
   * @return {boolean}
   */
  getRowHasChildren(row){
    if(!this.treeColumn) return;
    var children = this.rowsByGroup[row[this.treeColumn.prop]];
    return children !== undefined || (children && !children.length);
  }

  /**
   * Tree toggle event from a cell
   * @param  {scope}
   * @param  {row model}
   * @param  {cell model}
   */
  onTreeToggle(scope, row, cell){
    var val  = row[this.treeColumn.prop];
    scope.expanded[val] = !scope.expanded[val];
    this.getRows();

    scope.onTreeToggle({
      row: row,
      cell: cell
    });
  }

  /**
   * Invoked when a row directive's checkbox was changed.
   * @param  {index}
   * @param  {row}
   */
  onCheckboxChange(index, row){
    this.selectRow(index, row);
  }

  onGroupToggle(scope, row){
    scope.expanded[row.name] = !scope.expanded[row.name];
    this.getRows();
  }
}

/**
 * A helper for scrolling the body to a specific scroll position
 * when the footer pager is invoked.
 */
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
      columns: '=',
      columnWidths: '=',
      values: '=',
      options: '=',
      selected: '=',
      expanded: '=',
      onPage: '&',
      onTreeToggle: '&'
    },
    template: `
      <div class="dt-body" ng-style="body.styles()">
        <div class="dt-body-scroller" ng-style="body.scrollerStyles()">
        <div ng-repeat="r in body.rows track by $index">
            <dt-group-row ng-if="r.group"
                          ng-style="body.groupRowStyles(this, r)" 
                          on-group-toggle="body.onGroupToggle(this, group)"
                          expanded="body.getRowExpanded(this, r)"
                          tabindex="{{$index}}"
                          value="r">
            </dt-group-row>
            <dt-row ng-if="!r.group"
                    value="body.getRowValue($index)"
                    tabindex="{{$index}}"
                    columns="columns"
                    column-widths="columnWidths"
                    ng-keydown="body.keyDown($event, $index, r)"
                    ng-click="body.rowClicked($event, $index, r)"
                    on-tree-toggle="body.onTreeToggle(this, row, cell)"
                    ng-class="body.rowClasses(this, r)"
                    options="options"
                    selected="body.isSelected(r)"
                    on-checkbox-change="body.onCheckboxChange($index, row)"
                    columns="body.columnsByPin"
                    has-children="body.getRowHasChildren(r)"
                    expanded="body.getRowExpanded(this, r)"
                    ng-style="body.rowStyles(this, r)">
            </dt-row>
          </div>
        </div>
        <div ng-if="values && !values.length" 
             class="empty-row" 
             ng-bind="::options.emptyMessage">
       </div>
       <div ng-if="values === undefined" 
             class="loading-row"
             ng-bind="::options.loadingMessage">
       </div>
      </div>`,
    replace:true,
    link: function($scope, $elm, $attrs, ctrl){
      var ticking = false,
          lastScrollY = 0,
          lastScrollX = 0,
          helper = BodyHelper.create($elm);

      function update(){
        $timeout(() => {
          $scope.options.internal.offsetY = lastScrollY;
          $scope.options.internal.offsetX = lastScrollX;
          ctrl.updatePage();
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
