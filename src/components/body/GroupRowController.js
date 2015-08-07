export class GroupRowController {

  onGroupToggled(evt){
    evt.stopPropagation();
    this.onGroupToggle({
      group: this.row
    });
  }

  treeClass(){
    return {
      'dt-tree-toggle': true,
      'icon-right': !this.expanded,
      'icon-down': this.expanded
    };
  }

}
