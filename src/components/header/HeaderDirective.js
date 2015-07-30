import angular from 'angular';

export function HeaderDirective($timeout){
  return {
    restrict: 'E',
    controller: 'HeaderController',
    controllerAs: 'header',
    scope: true,
    bindToController: {
      options: '=',
      columns: '=',
      columnWidths: '=',
      onSort: '&',
      onResize: '&',
      onCheckboxChange: '&'
    },
    template: `
      <div class="dt-header" ng-style="header.styles()">
        <div class="dt-header-inner" ng-style="header.innerStyles()">
          <div class="dt-row-left"
               ng-style="header.stylesByGroup( 'left')"
               ng-if="header.columns['left'].length"
               sortable="header.options.reorderable"
               on-sortable-sort="columnsResorted(event, childScope)">
            <dt-header-cell ng-repeat="column in header.columns['left'] track by column.$id"
                            on-checkbox-change="header.onCheckboxChange()"
                            on-sort="dt.onSort(this, column)"
                            on-resize="header.onResize(column, width)"
                            selected="header.isSelected()"
                            column="column">
            </dt-header-cell>
          </div>
          <div class="dt-row-center"
               sortable="header.options.reorderable"
               ng-style="header.stylesByGroup( 'center')"
               on-sortable-sort="columnsResorted(event, childScope)">
            <dt-header-cell ng-repeat="column in header.columns['center'] track by column.$id"
                            on-checkbox-change="header.onCheckboxChange()"
                            on-sort="dt.onSort(this, column)"
                            selected="header.isSelected()"
                            on-resize="header.onResize(column, width)"
                            column="column">
            </dt-header-cell>
          </div>
          <div class="dt-row-right"
               ng-if="columns['right'].length"
               sortable="header.options.reorderable"
               ng-style="header.stylesByGroup( 'right')"
               on-sortable-sort="columnsResorted(event, childScope)">
            <dt-header-cell ng-repeat="column in header.columns['right'] track by column.$id"
                            on-checkbox-change="header.onCheckboxChange()"
                            on-sort="dt.onSort(column)"
                            selected="header.isSelected()"
                            on-resize="header.onResize(column, width)"
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
