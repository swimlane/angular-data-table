export function BodyDirective($timeout){
  return {
    restrict: 'E',
    controller: 'BodyController',
    controllerAs: 'body',
    scope: {
      columns: '=',
      columnWidths: '=',
      rows: '=',
      options: '=',
      selected: '=?',
      expanded: '=?',
      onPage: '&',
      onTreeToggle: '&',
      onSelect: '&',
      onRowClick: '&'
    },
    template: `
      <div class="dt-body" ng-style="body.styles()">
        <dt-scroller class="dt-body-scroller">
          <dt-group-row ng-repeat-start="r in body.tempRows track by $index"
                        ng-if="r.group"
                        ng-style="body.groupRowStyles(this, r)" 
                        on-group-toggle="body.onGroupToggle(this, group)"
                        expanded="body.getRowExpanded(this, r)"
                        tabindex="{{$index}}"
                        row="r">
          </dt-group-row>
          <dt-row ng-repeat-end
                  ng-if="!r.group"
                  row="body.getRowValue($index)"
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
        </dt-scroller>
        <div ng-if="rows && !rows.length" 
             class="empty-row" 
             ng-bind="::options.emptyMessage">
       </div>
       <div ng-if="rows === undefined" 
             class="loading-row"
             ng-bind="::options.loadingMessage">
        </div>
      </div>`
  };
};
