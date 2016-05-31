import angular from 'angular';
import { DataTableController } from './DataTableController';
import { ObjectId } from '../utils/utils';
import { DataTableService } from './DataTableService';

export const DataTableDirective = {
  controller: DataTableController,
  bindings: {
    options: '=',
    rows: '=',
    selected: '=?',
    expanded: '=?',
    onSelect: '&',
    onSort: '&',
    onTreeToggle: '&',
    onPage: '&',
    onRowClick: '&',
    onRowDblClick: '&',
    onColumnResize: '&'
  },
  template: function($element) {
    // Gets the column nodes to transposes to column objects
    // http://stackoverflow.com/questions/30845397/angular-expressive-directive-design/30847609#30847609
    const columns = $element[0].getElementsByTagName('column');
    const id = ObjectId();

    DataTableService.saveColumns(id, columns);

    return `
      <div 
        class="dt"
        ng-class="$ctrl.tableCss()"
        data-column-id="${id}">
        <dt-header 
          options="$ctrl.options"
           on-checkbox-change="$ctrl.onHeaderCheckboxChange()"
           columns="$ctrl.columnsByPin"
           column-widths="$ctrl.columnWidths"
           ng-if="$ctrl.options.headerHeight"
           on-resize="$ctrl.onResized(column, width)"
           selected="$ctrl.isAllRowsSelected()"
           on-sort="$ctrl.onSorted()">
        </dt-header>
        <dt-body rows="$ctrl.rows"
          selected="$ctrl.selected"
          expanded="$ctrl.expanded"
          columns="$ctrl.columnsByPin"
          on-select="$ctrl.onSelected(rows)"
          on-row-click="$ctrl.onRowClicked(row)"
          on-row-dbl-click="$ctrl.onRowDblClicked(row)"
          column-widths="$ctrl.columnWidths"
          options="$ctrl.options"
          on-page="$ctrl.onBodyPage(offset, size)"
          on-tree-toggle="$ctrl.onTreeToggled(row, cell)">
        </dt-body>
        <dt-footer 
          ng-if="$ctrl.options.footerHeight"
          ng-style="{ height: $ctrl.options.footerHeight + 'px' }"
          on-page="$ctrl.onFooterPage(offset, size)"
          paging="$ctrl.options.paging">
        </dt-footer>
      </div>
    `;
  }
};
