export class GroupRowController {

  onGroupToggle(evt, scope){
    evt.stopPropagation();
    scope.onGroupToggle({
      group: scope.row
    });
  }

  treeClass(scope){
    return {
      'dt-tree-toggle': true,
      'icon-right': !scope.expanded,
      'icon-down': scope.expanded
    };
  }

}
