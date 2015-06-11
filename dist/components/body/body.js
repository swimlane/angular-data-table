System.register(['angular', 'utils/utils', 'utils/keys'], function (_export) {
  'use strict';

  var angular, requestAnimFrame, ColumnsByPin, KEYS, BodyController, BodyHelper;

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  _export('BodyDirective', BodyDirective);

  function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function BodyDirective($timeout) {
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
      template: '\n      <div class="dt-body" ng-style="body.styles()">\n        <div class="dt-body-scroller" ng-style="body.scrollerStyles()">\n          <dt-group-row ng-repeat-start="r in body.rows track by $index"\n                        ng-if="r.group"\n                        ng-style="body.groupRowStyles(this, r)" \n                        on-group-toggle="body.onGroupToggle(this, group)"\n                        expanded="body.getRowExpanded(this, r)"\n                        tabindex="{{$index}}"\n                        value="r">\n          </dt-group-row>\n          <dt-row ng-repeat-end\n                  ng-if="!r.group"\n                  value="body.getRowValue($index)"\n                  tabindex="{{$index}}"\n                  columns="columns"\n                  column-widths="columnWidths"\n                  ng-keydown="body.keyDown($event, $index, r)"\n                  ng-click="body.rowClicked($event, $index, r)"\n                  on-tree-toggle="body.onTreeToggle(this, row, cell)"\n                  ng-class="body.rowClasses(this, r)"\n                  options="options"\n                  selected="body.isSelected(r)"\n                  on-checkbox-change="body.onCheckboxChange($index, row)"\n                  columns="body.columnsByPin"\n                  has-children="body.getRowHasChildren(r)"\n                  expanded="body.getRowExpanded(this, r)"\n                  ng-style="body.rowStyles(this, r)">\n          </dt-row>\n        </div>\n        <div ng-if="values && !values.length" \n             class="empty-row" \n             ng-bind="::options.emptyMessage">\n       </div>\n       <div ng-if="values === undefined" \n             class="loading-row"\n             ng-bind="::options.loadingMessage">\n       </div>\n      </div>',
      replace: true,
      link: function link($scope, $elm, $attrs, ctrl) {
        var ticking = false,
            lastScrollY = 0,
            lastScrollX = 0,
            helper = BodyHelper.create($elm);

        function update() {
          $timeout(function () {
            $scope.options.internal.offsetY = lastScrollY;
            $scope.options.internal.offsetX = lastScrollX;
            ctrl.updatePage();
          });

          ticking = false;
        };

        function requestTick() {
          if (!ticking) {
            requestAnimFrame(update);
            ticking = true;
          }
        };

        $elm.on('scroll', function (ev) {
          lastScrollY = this.scrollTop;
          lastScrollX = this.scrollLeft;
          requestTick();
        });
      }
    };
  }

  return {
    setters: [function (_angular) {
      angular = _angular['default'];
    }, function (_utilsUtils) {
      requestAnimFrame = _utilsUtils.requestAnimFrame;
      ColumnsByPin = _utilsUtils.ColumnsByPin;
    }, function (_utilsKeys) {
      KEYS = _utilsKeys.KEYS;
    }],
    execute: function () {
      BodyController = (function () {

        /**
         * A tale body controller
         * @param  {$scope}
         * @param  {$timeout}
         * @param  {throttle}
         * @return {BodyController}
         */
        /*@ngInject*/

        function BodyController($scope, $timeout, throttle) {
          var _this = this;

          _classCallCheck(this, BodyController);

          angular.extend(this, {
            $scope: $scope,
            options: $scope.options,
            selected: $scope.selected
          });

          this.rows = [];
          this._viewportRowsStart = 0;
          this._viewportRowsEnd = 0;

          this.treeColumn = $scope.options.columns.find(function (c) {
            return c.isTreeColumn;
          });

          this.groupColumn = $scope.options.columns.find(function (c) {
            return c.group;
          });

          if (this.options.scrollbarV) {
            $scope.$watch('options.internal.offsetY', throttle(this.getRows.bind(this), 10));
          }

          $scope.$watchCollection('values', function (newVal, oldVal) {
            if (newVal) {
              if (!_this.options.paging.externalPaging) {
                _this.options.paging.count = newVal.length;
              }

              _this.count = _this.options.paging.count;

              if (_this.treeColumn || _this.groupColumn) {
                _this.buildRowsByGroup();
              }

              if (_this.options.scrollbarV) {
                _this.getRows();
              } else {
                var _rows;

                var values = $scope.values;
                if (_this.treeColumn) {
                  values = _this.buildTree();
                } else if (_this.groupColumn) {
                  values = _this.buildGroups();
                }
                _this.rows.splice(0, _this.rows.length);
                (_rows = _this.rows).push.apply(_rows, _toConsumableArray(values));
              }
            }
          });

          if (this.options.scrollbarV) {
            $scope.$watch('options.internal.offsetY', this.updatePage.bind(this));
            $scope.$watch('options.paging.offset', function (newVal) {
              $scope.onPage({
                offset: newVal,
                size: _this.options.paging.size
              });
            });
          }
        }
        BodyController.$inject = ["$scope", "$timeout", "throttle"];

        _createClass(BodyController, [{
          key: 'getFirstLastIndexes',

          /**
           * Gets the first and last indexes based on the offset, row height, page size, and overall count.
           * @return {object}
           */
          value: function getFirstLastIndexes() {
            var firstRowIndex = Math.max(Math.floor((this.$scope.options.internal.offsetY || 0) / this.options.rowHeight, 0), 0),
                endIndex = Math.min(firstRowIndex + this.options.paging.size, this.count);

            return {
              first: firstRowIndex,
              last: endIndex
            };
          }
        }, {
          key: 'updatePage',

          /**
           * Updates the page's offset given the scroll position.
           * @param  {paging object}
           */
          value: function updatePage() {
            var idxs = this.getFirstLastIndexes(),
                curPage = Math.ceil(idxs.first / this.options.paging.size);
            this.options.paging.offset = curPage;
          }
        }, {
          key: 'buildRowsByGroup',

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
          value: function buildRowsByGroup() {
            this.index = {};
            this.rowsByGroup = {};

            var parentProp = this.treeColumn ? this.treeColumn.relationProp : this.groupColumn.prop;

            for (var i = 0, len = this.$scope.values.length; i < len; i++) {
              var row = this.$scope.values[i];
              // build groups
              var relVal = row[parentProp];
              if (relVal) {
                if (this.rowsByGroup[relVal]) {
                  this.rowsByGroup[relVal].push(row);
                } else {
                  this.rowsByGroup[relVal] = [row];
                }
              }

              // build indexes
              if (this.treeColumn) {
                var prop = this.treeColumn.prop;
                this.index[row[prop]] = row;

                if (row[parentProp] === undefined) {
                  row.$$depth = 0;
                } else {
                  var parent = this.index[row[parentProp]];
                  row.$$depth = parent.$$depth + 1;
                  if (parent.$$children) {
                    parent.$$children.push(row[prop]);
                  } else {
                    parent.$$children = [row[prop]];
                  }
                }
              }
            }
          }
        }, {
          key: 'buildGroups',

          /**
           * Rebuilds the groups based on what is expanded.
           * This function needs some optimization, todo for future release.
           * @return {Array} the temp array containing expanded rows
           */
          value: function buildGroups() {
            var _this2 = this;

            var temp = [];

            angular.forEach(this.rowsByGroup, function (v, k) {
              temp.push({
                name: k,
                group: true
              });

              if (_this2.$scope.expanded[k]) {
                temp.push.apply(temp, _toConsumableArray(v));
              }
            });

            return temp;
          }
        }, {
          key: 'buildTree',

          /**
           * Creates a tree of the existing expanded values
           * @return {array} the built tree
           */
          value: function buildTree() {
            var count = 0,
                temp = [];

            for (var i = 0, len = this.$scope.values.length; i < len; i++) {
              var row = this.$scope.values[i],
                  relVal = row[this.treeColumn.relationProp],
                  keyVal = row[this.treeColumn.prop],
                  rows = this.rowsByGroup[keyVal],
                  expanded = this.$scope.expanded[keyVal];

              if (!relVal) {
                count++;
                temp.push(row);
              }

              if (rows && rows.length) {
                if (expanded) {
                  temp.push.apply(temp, _toConsumableArray(rows));
                  count = count + rows.length;
                }
              }
            }

            return temp;
          }
        }, {
          key: 'getRows',

          /**
           * Creates the intermediate collection that is shown in the view.
           * @param  {boolean} refresh - bust the tree/group cache
           */
          value: function getRows(refresh) {
            // only proceed when we have pre-aggregated the values
            if ((this.treeColumn || this.groupColumn) && !this.rowsByGroup) {
              return false;
            }

            var temp;

            if (this.treeColumn) {
              temp = this.treeTemp || [];
              // cache the tree build
              if (refresh || !this.treeTemp) {
                this.treeTemp = temp = this.buildTree();
                this.count = temp.length;

                // have to force reset, optimize this later
                this.rows.splice(0, this.rows.length);
              }
            } else if (this.groupColumn) {
              temp = this.groupsTemp || [];
              // cache the group build
              if (refresh || !this.groupsTemp) {
                this.groupsTemp = temp = this.buildGroups();
                this.count = temp.length;
              }
            } else {
              temp = this.$scope.values;
            }

            var idx = 0,
                indexes = this.getFirstLastIndexes(),
                rowIndex = indexes.first;

            while (rowIndex < indexes.last || this.options.internal.bodyHeight < this._viewportHeight && rowIndex < this.count) {

              var row = temp[rowIndex];
              if (row) {
                row.$$index = rowIndex;
                this.rows[idx] = row;
              }

              idx++;
              this._viewportRowsEnd = rowIndex++;
            }
          }
        }, {
          key: 'styles',

          /**
           * Returns the styles for the table body directive.
           * @return {object}
           */
          value: function styles() {
            var styles = {
              width: this.options.internal.innerWidth + 'px'
            };

            if (!this.options.scrollbarV) {
              styles.overflowY = 'hidden';
            } else if (this.options.scrollbarH === false) {
              styles.overflowX = 'hidden';
            }

            if (this.options.scrollbarV) {
              styles.height = this.options.internal.bodyHeight + 'px';
            }

            return styles;
          }
        }, {
          key: 'rowStyles',

          /**
           * Returns the styles for the row diretive.
           * @param  {scope}
           * @param  {row}
           * @return {styles object}
           */
          value: function rowStyles(scope, row) {
            var styles = {
              height: scope.options.rowHeight + 'px'
            };

            if (scope.options.scrollbarV) {
              styles.transform = 'translate3d(0, ' + row.$$index * scope.options.rowHeight + 'px, 0)';
            }

            return styles;
          }
        }, {
          key: 'groupRowStyles',

          /**
           * Builds the styles for the row group directive
           * @param  {object} scope 
           * @param  {object} row   
           * @return {object} styles
           */
          value: function groupRowStyles(scope, row) {
            var styles = this.rowStyles(scope, row);
            styles.width = scope.columnWidths.total + 'px';
            return styles;
          }
        }, {
          key: 'rowClasses',

          /**
           * Returns the css classes for the row directive.
           * @param  {scope}
           * @param  {row}
           * @return {css class object}
           */
          value: function rowClasses(scope, row) {
            var styles = {
              'selected': this.isSelected(row)
            };

            if (this.treeColumn) {
              // if i am a child
              styles['dt-leaf'] = this.rowsByGroup[row[this.treeColumn.relationProp]];
              // if i have children
              styles['dt-has-leafs'] = this.rowsByGroup[row[this.treeColumn.prop]];
              // the depth
              styles['dt-depth-' + row.$$depth] = true;
            }

            return styles;
          }
        }, {
          key: 'isSelected',

          /**
           * Returns if the row is selected
           * @param  {row}
           * @return {Boolean}
           */
          value: function isSelected(row) {
            var selected = false;

            if (this.options.selectable) {
              if (this.options.multiSelect) {
                selected = this.selected.indexOf(row) > -1;
              } else {
                selected = this.selected === row;
              }
            }

            return selected;
          }
        }, {
          key: 'keyDown',

          /**
           * Handler for the keydown on a row
           * @param  {event}
           * @param  {index}
           * @param  {row}
           */
          value: function keyDown(ev, index, row) {
            ev.preventDefault();

            if (ev.keyCode === KEYS.DOWN) {
              var next = ev.target.nextElementSibling;
              if (next) {
                next.focus();
              }
            } else if (ev.keyCode === KEYS.UP) {
              var prev = ev.target.previousElementSibling;
              if (prev) {
                prev.focus();
              }
            } else if (ev.keyCode === KEYS.RETURN) {
              this.selectRow(index, row);
            }
          }
        }, {
          key: 'rowClicked',

          /**
           * Handler for the row click event
           * @param  {event}
           * @param  {index}
           * @param  {row}
           */
          value: function rowClicked(event, index, row) {
            if (!this.options.checkboxSelection) {
              event.preventDefault();

              this.selectRow(index, row);

              if (this.$scope.onSelect) {
                this.$scope.onSelect({ row: row });
              }
            }
          }
        }, {
          key: 'selectRow',

          /**
           * Selects a row and places in the selection collection
           * @param  {index}
           * @param  {row}
           */
          value: function selectRow(index, row) {
            if (this.options.selectable) {
              if (this.options.multiSelect) {
                var isCtrlKeyDown = event.ctrlKey || event.metaKey,
                    isShiftKeyDown = event.shiftKey;

                if (isShiftKeyDown) {
                  this.selectRowsBetween(index, row);
                } else {
                  var idx = this.selected.indexOf(row);
                  if (idx > -1) {
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
        }, {
          key: 'selectRowsBetween',

          /**
           * Selectes the rows between a index.  Used for shift click selection.
           * @param  {index}
           */
          value: function selectRowsBetween(index) {
            for (var i = 0, len = this.rows.length; i < len; i++) {
              var row = this.rows[i];
              if (i >= this.prevIndex && i <= index) {
                var idx = this.selected.indexOf(row);
                if (idx === -1) {
                  this.selected.push(row);
                }
              }
            }
          }
        }, {
          key: 'scrollerStyles',

          /**
           * Returns the virtual row height.
           * @return {[height]}
           */
          value: function scrollerStyles() {
            return {
              height: this.count * this.options.rowHeight + 'px'
            };
          }
        }, {
          key: 'getRowValue',

          /**
           * Returns the row model for the index in the view.
           * @param  {index}
           * @return {row model}
           */
          value: function getRowValue(idx) {
            return this.rows[idx];
          }
        }, {
          key: 'getRowExpanded',

          /**
           * Calculates if a row is expanded or collasped for tree grids.
           * @param  {scope}
           * @param  {row}
           * @return {boolean}
           */
          value: function getRowExpanded(scope, row) {
            if (this.treeColumn) {
              return scope.expanded[row[this.treeColumn.prop]];
            } else if (this.groupColumn) {
              return scope.expanded[row.name];
            }
          }
        }, {
          key: 'getRowHasChildren',

          /**
           * Calculates if the row has children
           * @param  {row}
           * @return {boolean}
           */
          value: function getRowHasChildren(row) {
            if (!this.treeColumn) return;
            var children = this.rowsByGroup[row[this.treeColumn.prop]];
            return children !== undefined || children && !children.length;
          }
        }, {
          key: 'onTreeToggle',

          /**
           * Tree toggle event from a cell
           * @param  {scope}
           * @param  {row model}
           * @param  {cell model}
           */
          value: function onTreeToggle(scope, row, cell) {
            var val = row[this.treeColumn.prop];
            scope.expanded[val] = !scope.expanded[val];

            if (this.options.scrollbarV) {
              this.getRows(true);
            } else {
              var _rows2;

              var values = this.buildTree();
              this.rows.splice(0, this.rows.length);
              (_rows2 = this.rows).push.apply(_rows2, _toConsumableArray(values));
            }

            scope.onTreeToggle({
              row: row,
              cell: cell
            });
          }
        }, {
          key: 'onCheckboxChange',

          /**
           * Invoked when a row directive's checkbox was changed.
           * @param  {index}
           * @param  {row}
           */
          value: function onCheckboxChange(index, row) {
            this.selectRow(index, row);
          }
        }, {
          key: 'onGroupToggle',

          /**
           * Invoked when the row group directive was expanded
           * @param  {object} scope 
           * @param  {object} row   
           */
          value: function onGroupToggle(scope, row) {
            scope.expanded[row.name] = !scope.expanded[row.name];

            if (this.options.scrollbarV) {
              this.getRows(true);
            } else {
              var _rows3;

              var values = this.buildGroups();
              this.rows.splice(0, this.rows.length);
              (_rows3 = this.rows).push.apply(_rows3, _toConsumableArray(values));
            }
          }
        }]);

        return BodyController;
      })();

      _export('BodyController', BodyController);

      /**
       * A helper for scrolling the body to a specific scroll position
       * when the footer pager is invoked.
       */

      BodyHelper = (function () {
        var _elm;
        return {
          create: function create(elm) {
            _elm = elm;
          },
          setYOffset: function setYOffset(offsetY) {
            _elm[0].scrollTop = offsetY;
          }
        };
      })();

      _export('BodyHelper', BodyHelper);

      ;
    }
  };
});