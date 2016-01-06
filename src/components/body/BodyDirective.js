import { BodyController } from './BodyController';

export function BodyDirective($timeout){
  return {
    restrict: 'E',
    controller: BodyController,
    controllerAs: 'body',
    bindToController: {
      columns: '=',
      columnWidths: '=',
      rows: '=',
      options: '=',
      selected: '=?',
      expanded: '=?',
      onPage: '&',
      onTreeToggle: '&',
      onSelect: '&',
      onRowClick: '&',
      onRowDblClick: '&'
    },
    scope: true,
    template: `
      <div 
        class="progress-linear" 
        role="progressbar" 
        ng-show="body.options.paging.loadingIndicator">
        <div class="container">
          <div class="bar"></div>
        </div>
      </div>
      <div class="dt-body" ng-style="body.styles()" dt-seletion>
        <dt-scroller class="dt-body-scroller">
          <dt-group-row ng-repeat-start="r in body.tempRows track by $index"
                        ng-if="r.group"
                        ng-style="body.groupRowStyles(r)" 
                        options="body.options"
                        on-group-toggle="body.onGroupToggle(group)"
                        expanded="body.getRowExpanded(r)"
                        tabindex="{{$index}}"
                        row="r">
          </dt-group-row>
          <dt-row ng-repeat-end
                  ng-if="!r.group"
                  row="body.getRowValue($index)"
                  tabindex="{{$index}}"
                  columns="body.columns"
                  column-widths="body.columnWidths"
                  ng-keydown="selCtrl.keyDown($event, $index, r)"
                  ng-click="selCtrl.rowClicked($event, r.$$index, r)"
                  ng-dblclick="selCtrl.rowDblClicked($event, r.$$index, r)"
                  on-tree-toggle="body.onTreeToggled(row, cell)"
                  ng-class="body.rowClasses(r)"
                  options="body.options"
                  selected="body.isSelected(r)"
                  on-checkbox-change="selCtrl.onCheckboxChange($event, $index, row)"
                  columns="body.columnsByPin"
                  has-children="body.getRowHasChildren(r)"
                  expanded="body.getRowExpanded(r)"
                  ng-style="body.rowStyles(r)">
          </dt-row>
        </dt-scroller>
        <div ng-if="body.rows && !body.rows.length" 
             class="empty-row" 
             ng-bind="::body.options.emptyMessage">
       </div>
       <div ng-if="body.rows === undefined" 
             class="loading-row"
             ng-bind="::body.options.loadingMessage">
        </div>
      </div>`
  };
};
