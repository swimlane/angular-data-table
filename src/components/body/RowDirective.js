export function RowDirective(){
  return {
    restrict: 'E',
    controller: 'RowController',
    controllerAs: 'rowCtrl',
    scope: {
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
             ng-if="columns['left'].length"
             ng-style="rowCtrl.stylesByGroup(this, 'left')">
          <dt-cell ng-repeat="column in columns['left'] track by column.$id"
                   on-tree-toggle="rowCtrl.onTreeToggle(this, cell)"
                   column="column"
                   options="options"
                   has-children="hasChildren"
                   on-checkbox-change="rowCtrl.onCheckboxChange(this)"
                   selected="selected"
                   expanded="expanded"
                   row="row"
                   value="rowCtrl.getValue(this, column)">
          </dt-cell>
        </div>
        <div class="dt-row-center dt-row-block" 
             ng-style="rowCtrl.stylesByGroup(this, 'center')">
          <dt-cell ng-repeat="column in columns['center'] track by column.$id"
                   on-tree-toggle="rowCtrl.onTreeToggle(this, cell)"
                   column="column"
                   options="options"
                   has-children="hasChildren"
                   expanded="expanded"
                   selected="selected"
                   row="row"
                   on-checkbox-change="rowCtrl.onCheckboxChange(this)"
                   value="rowCtrl.getValue(this, column)">
          </dt-cell>
        </div>
        <div class="dt-row-right dt-row-block" 
             ng-if="columns['right'].length"
             ng-style="rowCtrl.stylesByGroup(this, 'right')">
          <dt-cell ng-repeat="column in columns['right'] track by column.$id"
                   on-tree-toggle="rowCtrl.onTreeToggle(this, cell)"
                   column="column"
                   options="options"
                   has-children="hasChildren"
                   selected="selected"
                   on-checkbox-change="rowCtrl.onCheckboxChange(this)"
                   row="row"
                   expanded="expanded"
                   value="rowCtrl.getValue(this, column)">
          </dt-cell>
        </div>
      </div>`,
    replace:true
  };
};
