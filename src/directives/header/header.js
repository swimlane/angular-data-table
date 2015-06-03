import angular from 'angular';
import { ColumnTotalWidth } from 'utils/math';
import { Sortable } from 'utils/sortable';

export class HeaderController {

  /**
   * Creates an instance of the HeaderController
   * @param  {$scope}
   * @return {HeaderController}
   */
  constructor($scope){
    $scope.$watch('options.columns', (newVal, oldVal) => {
      this.columnsChanged($scope, newVal, oldVal);
    }, true);
  }

  /**
   * Returns the styles for the header directive.
   * @param  {scope}
   * @return {styles object}
   */
  styles(scope) {
    return {
      width: scope.options.internal.innerWidth + 'px',
      height: scope.options.headerHeight + 'px'
    }
  }

  /**
   * Returns the inner styles for the header directive
   * @param  {scope}
   * @return {styles object}
   */
  innerStyles(scope){
    return {
      width: ColumnTotalWidth(scope.options.columns) + 'px'
      
    };
  }

  /**
   * Invoked when a column attribute is changed to detect
   * if sort was trigger to resort the columns.
   * @param  {new column}
   * @param  {old column}
   */
  columnsChanged(scope, newVal, oldVal){
    // this is not idea ... todo better
    var sorted = false;

    newVal.forEach((c, i) => {
      var old = oldVal[i];
      if(c.prop === old.prop && c.sort !== oldVal[i].sort){
        sorted = true;
      }
    });

    scope.onSort({
      columns: newVal
    })
  }

  /**
   * Returns the styles by group for the headers.
   * @param  {scope}
   * @param  {group}
   * @return {styles object}
   */
  stylesByGroup(scope, group){
    var cols = scope.options.columns.filter((c) => {
      if(group === 'left' && c.frozenLeft){
        return c;
      } else if(group === 'right' && c.frozenRight){
        return c;
      } else if(group === 'center') {
        return c;
      }
    });

    var styles = {
      width: ColumnTotalWidth(cols) + 'px'
    };

    if(group === 'center'){
      styles['transform'] = `translate3d(-${scope.options.internal.offsetX}px, 0, 0)`
    }

    return styles;
  }

  /**
   * Invoked when the header cell directive's checkbox has changed.
   * @param  {scope}
   */
  onCheckboxChange(scope){
    scope.onCheckboxChange();
  }

};

export function HeaderDirective($timeout){

  return {
    restrict: 'E',
    controller: 'HeaderController',
    controllerAs: 'header',
    scope: {
      options: '=',
      onSort: '&',
      onCheckboxChange: '='
    },
    template: `
      <div class="dt-header" ng-style="header.styles(this)">
        <div class="dt-header-inner" ng-style="header.innerStyles(this)">
          <div class="dt-row-left"
               ng-style="header.stylesByGroup(this, 'left')"
               sortable="options.reorderable"
               on-checkbox-change="header.onCheckboxChange(this)"
               selected="header.isSelected(this)"
               on-sort="sorted(event, childScope)">
            <dt-header-cell ng-repeat="column in options.columns | filter: { frozenLeft: true }" 
              column="column"></dt-header-cell>
          </div>
          <div class="dt-row-center" 
               sortable="options.reorderable"
               ng-style="header.stylesByGroup(this, 'center')"
               on-checkbox-change="header.onCheckboxChange(this)"
               selected="header.isSelected(this)"
               on-sort="sorted(event, childScope)">
            <dt-header-cell ng-repeat="column in options.columns | filter: { frozenLeft: false, frozenRight: false }" 
              column="column"></dt-header-cell>
          </div>
          <div class="dt-row-right"
               sortable="options.reorderable"
               ng-style="header.stylesByGroup(this, 'right')"
               on-checkbox-change="header.onCheckboxChange(this)"
               selected="header.isSelected(this)"
               on-sort="sorted(event, childScope)">
            <dt-header-cell ng-repeat="column in options.columns | filter: { frozenRight: true }" 
              column="column"></dt-header-cell>
          </div>
        </div>
      </div>`,
    replace:true,
    link: function($scope, $elm, $attrs){

      $scope.sorted = function(event, childScope){
        var col = childScope.column,
            idx = $scope.options.columns.indexOf(col),
            parent = angular.element(event.currentTarget),
            newIdx = -1;

        angular.forEach(parent.children(), (c, i) => {
          if(childScope === angular.element(c).scope()){
            newIdx = i;
          }
        });

        $timeout(() => {
          $scope.options.columns.splice(idx, 1);
          $scope.options.columns.splice(newIdx, 0, col);
        });
      }

    }
  };
};
