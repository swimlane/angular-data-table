import angular from 'angular';

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
               ng-if="columns['left'].length"
               sortable="header.options.reorderable"
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
               sortable="header.options.reorderable"
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
               ng-if="columns['right'].length"
               sortable="header.options.reorderable"
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

              // this is tricky because we want to update the index
              // in the orig columns array instead of the grouped one
              var curColAtIdx = group[newIdx],
                  siblingIdx = $scope.header.options.columns.indexOf(curColAtIdx),
                  curIdx = $scope.header.options.columns.indexOf(col);

              $scope.header.options.columns.splice(curIdx, 1);
              $scope.header.options.columns.splice(siblingIdx, 0, col);

              return false;
            }
          });

        });
      }
    }
  };
};
