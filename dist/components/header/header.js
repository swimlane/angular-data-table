System.register(['angular', 'utils/sortable'], function (_export) {
  'use strict';

  var angular, Sortable, HeaderController;

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  _export('HeaderDirective', HeaderDirective);

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function HeaderDirective($timeout) {

    return {
      restrict: 'E',
      controller: 'HeaderController',
      controllerAs: 'header',
      scope: {
        options: '=',
        columns: '=',
        columnWidths: '=',
        onSort: '&',
        onResize: '&',
        onCheckboxChange: '&'
      },
      template: '\n      <div class="dt-header" ng-style="header.styles(this)">\n        <div class="dt-header-inner" ng-style="header.innerStyles(this)">\n          <div class="dt-row-left"\n               ng-style="header.stylesByGroup(this, \'left\')"\n               sortable="options.reorderable"\n               on-sortable-sort="columnsResorted(event, childScope)">\n            <dt-header-cell ng-repeat="column in columns[\'left\'] track by column.name" \n                            on-checkbox-change="header.onCheckboxChange(this)"\n                            on-sort="header.onSort(this, column)"\n                            on-resize="header.onResize(this, column, width)"\n                            selected="header.isSelected(this)"\n                            column="column">\n            </dt-header-cell>\n          </div>\n          <div class="dt-row-center" \n               sortable="options.reorderable"\n               ng-style="header.stylesByGroup(this, \'center\')"\n               on-sortable-sort="columnsResorted(event, childScope)">\n            <dt-header-cell ng-repeat="column in columns[\'center\'] track by column.name" \n                            on-checkbox-change="header.onCheckboxChange(this)"\n                            on-sort="header.onSort(this, column)"\n                            selected="header.isSelected(this)"\n                            on-resize="header.onResize(this, column, width)"\n                            column="column">\n            </dt-header-cell>\n          </div>\n          <div class="dt-row-right"\n               sortable="options.reorderable"\n               ng-style="header.stylesByGroup(this, \'right\')"\n               on-sortable-sort="columnsResorted(event, childScope)">\n            <dt-header-cell ng-repeat="column in columns[\'right\'] track by column.name" \n                            on-checkbox-change="header.onCheckboxChange(this)"\n                            on-sort="header.onSort(this, column)"\n                            selected="header.isSelected(this)"\n                            on-resize="header.onResize(this, column, width)"\n                            column="column">\n            </dt-header-cell>\n          </div>\n        </div>\n      </div>',
      replace: true,
      link: function link($scope, $elm, $attrs, ctrl) {

        $scope.columnsResorted = function (event, childScope) {
          var col = childScope.column,
              parent = angular.element(event.currentTarget),
              newIdx = -1;

          angular.forEach(parent.children(), function (c, i) {
            if (childScope === angular.element(c).scope()) {
              newIdx = i;
            }
          });

          $timeout(function () {
            angular.forEach($scope.columns, function (group) {
              var idx = group.indexOf(col);
              if (idx > -1) {
                group.splice(idx, 1);
                group.splice(newIdx, 0, col);
              }
            });
          });
        };
      }
    };
  }

  return {
    setters: [function (_angular) {
      angular = _angular['default'];
    }, function (_utilsSortable) {
      Sortable = _utilsSortable.Sortable;
    }],
    execute: function () {
      HeaderController = (function () {
        function HeaderController() {
          _classCallCheck(this, HeaderController);
        }

        _createClass(HeaderController, [{
          key: 'styles',

          /**
           * Returns the styles for the header directive.
           * @param  {object} scope
           * @return {object} styles
           */
          value: function styles(scope) {
            return {
              width: scope.options.internal.innerWidth + 'px',
              height: scope.options.headerHeight + 'px'
            };
          }
        }, {
          key: 'innerStyles',

          /**
           * Returns the inner styles for the header directive
           * @param  {object} scope
           * @return {object} styles
           */
          value: function innerStyles(scope) {
            return {
              width: scope.columnWidths.total + 'px'
            };
          }
        }, {
          key: 'onSort',

          /**
           * Invoked when a column sort direction has changed
           * @param  {object} scope
           * @param  {object} column
           */
          value: function onSort(scope, column) {
            scope.onSort({
              column: column
            });
          }
        }, {
          key: 'stylesByGroup',

          /**
           * Returns the styles by group for the headers.
           * @param  {scope}
           * @param  {group}
           * @return {styles object}
           */
          value: function stylesByGroup(scope, group) {
            var styles = {
              width: scope.columnWidths[group] + 'px'
            };

            if (group === 'center') {
              styles['transform'] = 'translate3d(-' + scope.options.internal.offsetX + 'px, 0, 0)';
            } else if (group === 'right') {
              var offset = scope.columnWidths.total - scope.options.internal.innerWidth;
              styles.transform = 'translate3d(-' + offset + 'px, 0, 0)';
            }

            return styles;
          }
        }, {
          key: 'onCheckboxChange',

          /**
           * Invoked when the header cell directive's checkbox has changed.
           * @param  {scope}
           */
          value: function onCheckboxChange(scope) {
            scope.onCheckboxChange();
          }
        }, {
          key: 'onResize',

          /**
           * Occurs when a header cell directive triggered a resize
           * @param  {object} scope  
           * @param  {object} column 
           * @param  {int} width  
           */
          value: function onResize(scope, column, width) {
            scope.onResize({
              column: column,
              width: width
            });
          }
        }]);

        return HeaderController;
      })();

      _export('HeaderController', HeaderController);

      ;

      ;
    }
  };
});