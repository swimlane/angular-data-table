export function RowDirective(){
  return {
    restrict: 'E',
    controller: 'RowController',
    controllerAs: 'rowCtrl',
    scope: true,
    bindToController: {
      row: '=',
      columns: '=',
      columnWidths: '=',
      expanded: '=',
      selected: '=',
      hasChildren: '=',
      options: '=',
      onCheckboxChange: '&',
      onTreeToggle: '&'
    },
    template: `
      <div class="dt-row">
        <div class="dt-row-left dt-row-block"
             ng-if="rowCtrl.columns['left'].length"
             ng-style="rowCtrl.stylesByGroup('left')">
          <dt-cell ng-repeat="column in rowCtrl.columns['left'] track by column.$id"
                   on-tree-toggle="rowCtrl.onTreeToggle(cell)"
                   column="column"
                   options="options"
                   has-children="hasChildren"
                   on-checkbox-change="rowCtrl.onCheckboxChange()"
                   selected="selected"
                   expanded="expanded"
                   row="row"
                   value="rowCtrl.getValue(column)">
          </dt-cell>
        </div>
        <div class="dt-row-center dt-row-block"
             ng-style="rowCtrl.stylesByGroup('center')">
          <dt-cell ng-repeat="column in rowCtrl.columns['center'] track by column.$id"
                   on-tree-toggle="rowCtrl.onTreeToggle(cell)"
                   column="column"
                   options="options"
                   has-children="hasChildren"
                   expanded="expanded"
                   selected="selected"
                   row="row"
                   on-checkbox-change="rowCtrl.onCheckboxChange()"
                   value="rowCtrl.getValue(column)">
          </dt-cell>
        </div>
        <div class="dt-row-right dt-row-block"
             ng-if="columns['right'].length"
             ng-style="rowCtrl.stylesByGroup('right')">
          <dt-cell ng-repeat="column in rowCtrl.columns['right'] track by column.$id"
                   on-tree-toggle="rowCtrl.onTreeToggle(cell)"
                   column="column"
                   options="options"
                   has-children="hasChildren"
                   selected="selected"
                   on-checkbox-change="rowCtrl.onCheckboxChange()"
                   row="row"
                   expanded="expanded"
                   value="rowCtrl.getValue(column)">
          </dt-cell>
        </div>
      </div>`,
    replace:true
  };
};
