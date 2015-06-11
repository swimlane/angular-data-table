System.register(['angular', 'utils/utils'], function (_export) {
  'use strict';

  var angular, DeepValueGetter, RowController;

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  _export('RowDirective', RowDirective);

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function RowDirective() {
    return {
      restrict: 'E',
      controller: 'RowController',
      controllerAs: 'row',
      scope: {
        value: '=',
        columns: '=',
        columnWidths: '=',
        expanded: '=',
        selected: '=',
        hasChildren: '=',
        options: '=',
        onCheckboxChange: '&',
        onTreeToggle: '&'
      },
      template: '\n      <div class="dt-row">\n        <div class="dt-row-left dt-row-block" ng-style="row.stylesByGroup(this, \'left\')">\n          <dt-cell ng-repeat="column in columns[\'left\'] track by $index"\n                   on-tree-toggle="row.onTreeToggle(this, cell)"\n                   column="column"\n                   has-children="hasChildren"\n                   on-checkbox-change="row.onCheckboxChange(this)"\n                   selected="selected"\n                   expanded="expanded"\n                   value="row.getValue(this, column)">\n          </dt-cell>\n        </div>\n        <div class="dt-row-center dt-row-block" ng-style="row.stylesByGroup(this, \'center\')">\n          <dt-cell ng-repeat="column in columns[\'center\'] track by $index"\n                   on-tree-toggle="row.onTreeToggle(this, cell)"\n                   column="column"\n                   has-children="hasChildren"\n                   expanded="expanded"\n                   selected="selected"\n                   on-checkbox-change="row.onCheckboxChange(this)"\n                   value="row.getValue(this, column)">\n          </dt-cell>\n        </div>\n        <div class="dt-row-right dt-row-block" ng-style="row.stylesByGroup(this, \'right\')">\n          <dt-cell ng-repeat="column in columns[\'right\'] track by $index"\n                   on-tree-toggle="row.onTreeToggle(this, cell)"\n                   column="column"\n                   has-children="hasChildren"\n                   selected="selected"\n                   on-checkbox-change="row.onCheckboxChange(this)"\n                   expanded="expanded"\n                   value="row.getValue(this, column)">\n          </dt-cell>\n        </div>\n      </div>',
      replace: true
    };
  }

  return {
    setters: [function (_angular) {
      angular = _angular['default'];
    }, function (_utilsUtils) {
      DeepValueGetter = _utilsUtils.DeepValueGetter;
    }],
    execute: function () {
      RowController = (function () {
        function RowController() {
          _classCallCheck(this, RowController);
        }

        _createClass(RowController, [{
          key: 'getValue',

          /**
           * Returns the value for a given column
           * @param  {scope}
           * @param  {col}
           * @return {value}
           */
          value: function getValue(scope, col) {
            return DeepValueGetter(scope.value, col.prop);
          }
        }, {
          key: 'onTreeToggle',

          /**
           * Invoked when a cell triggers the tree toggle
           * @param  {scope}
           * @param  {cell}
           */
          value: function onTreeToggle(scope, cell) {
            scope.onTreeToggle({
              cell: cell,
              row: scope.value
            });
          }
        }, {
          key: 'stylesByGroup',

          /**
           * Calculates the styles for a pin group
           * @param  {scope}
           * @param  {group}
           * @return {styles object}
           */
          value: function stylesByGroup(scope, group) {
            var styles = {
              width: scope.columnWidths[group] + 'px'
            };

            if (group === 'left') {
              styles.transform = 'translate3d(' + scope.options.internal.offsetX + 'px, 0, 0)';
            } else if (group === 'right') {
              var offset = scope.columnWidths.total - scope.options.internal.innerWidth - scope.options.internal.offsetX;
              styles.transform = 'translate3d(-' + offset + 'px, 0, 0)';
            }

            return styles;
          }
        }, {
          key: 'onCheckboxChange',

          /**
           * Invoked when the cell directive's checkbox changed state
           * @param  {scope}
           */
          value: function onCheckboxChange(scope) {
            scope.onCheckboxChange({
              row: scope.value
            });
          }
        }]);

        return RowController;
      })();

      _export('RowController', RowController);

      ;
    }
  };
});