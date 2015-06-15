import angular from 'angular';
import { Sortable } from '../../utils/sortable';

export class HeaderController {

  /**
   * Returns the styles for the header directive.
   * @param  {object} scope
   * @return {object} styles
   */
  styles(scope) {
    return {
      width: scope.options.internal.innerWidth + 'px',
      height: scope.options.headerHeight + 'px'
    }
  }

  /**
   * Returns the inner styles for the header directive
   * @param  {object} scope
   * @return {object} styles
   */
  innerStyles(scope){
    return {
      width: scope.columnWidths.total + 'px'
    };
  }

  /**
   * Invoked when a column sort direction has changed
   * @param  {object} scope
   * @param  {object} column
   */
  onSort(scope, column){
    scope.onSort({
      column: column
    });
  }

  /**
   * Returns the styles by group for the headers.
   * @param  {scope}
   * @param  {group}
   * @return {styles object}
   */
  stylesByGroup(scope, group){
    var styles = {
      width: scope.columnWidths[group] + 'px'
    };

    if(group === 'center'){
      styles['transform'] = `translate3d(-${scope.options.internal.offsetX}px, 0, 0)`
    } else if(group === 'right'){
      var offset = (scope.columnWidths.total - scope.options.internal.innerWidth);
      styles.transform = `translate3d(-${offset}px, 0, 0)`;
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

  /**
   * Occurs when a header cell directive triggered a resize
   * @param  {object} scope  
   * @param  {object} column 
   * @param  {int} width  
   */
  onResize(scope, column, width){
    scope.onResize({
      column: column,
      width: width
    });
  }

};

export function HeaderDirective($timeout){

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
    template: `
      <div class="dt-header" ng-style="header.styles(this)">
        <div class="dt-header-inner" ng-style="header.innerStyles(this)">
          <div class="dt-row-left"
               ng-style="header.stylesByGroup(this, 'left')"
               sortable="options.reorderable"
               on-sortable-sort="columnsResorted(event, childScope)">
            <dt-header-cell ng-repeat="column in columns['left'] track by column.$id" 
                            on-checkbox-change="header.onCheckboxChange(this)"
                            on-sort="header.onSort(this, column)"
                            on-resize="header.onResize(this, column, width)"
                            selected="header.isSelected(this)"
                            column="column">
            </dt-header-cell>
          </div>
          <div class="dt-row-center" 
               sortable="options.reorderable"
               ng-style="header.stylesByGroup(this, 'center')"
               on-sortable-sort="columnsResorted(event, childScope)">
            <dt-header-cell ng-repeat="column in columns['center'] track by column.$id" 
                            on-checkbox-change="header.onCheckboxChange(this)"
                            on-sort="header.onSort(this, column)"
                            selected="header.isSelected(this)"
                            on-resize="header.onResize(this, column, width)"
                            column="column">
            </dt-header-cell>
          </div>
          <div class="dt-row-right"
               sortable="options.reorderable"
               ng-style="header.stylesByGroup(this, 'right')"
               on-sortable-sort="columnsResorted(event, childScope)">
            <dt-header-cell ng-repeat="column in columns['right'] track by column.$id" 
                            on-checkbox-change="header.onCheckboxChange(this)"
                            on-sort="header.onSort(this, column)"
                            selected="header.isSelected(this)"
                            on-resize="header.onResize(this, column, width)"
                            column="column">
            </dt-header-cell>
          </div>
        </div>
      </div>`,
    replace:true,
    link: function($scope, $elm, $attrs, ctrl){

      $scope.columnsResorted = function(event, childScope){
        var col = childScope.column,
            parent = angular.element(event.currentTarget),
            newIdx = -1;

        angular.forEach(parent.children(), (c, i) => {
          if(childScope === angular.element(c).scope()){
            newIdx = i;
          }
        });

        $timeout(() => {
          angular.forEach($scope.columns, (group) => {
            var idx = group.indexOf(col);
            if(idx > -1){
              group.splice(idx, 1);
              group.splice(newIdx, 0, col);
            }
          });
          
        });
      }
    }
  };
};
