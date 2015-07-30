export function GroupRowDirective(){
  return {
    restrict: 'E',
    controller: 'GroupRowController',
    controllerAs: 'group',
    scope: true,
    bindToController: {
      row: '=',
      onGroupToggle: '&',
      expanded: '='
    },
    replace:true,
    template: `
      <div class="dt-group-row">
        <span ng-class="group.treeClass(this)"
              ng-click="group.onGroupToggle($event, this)">
        </span>
        <span class="dt-group-row-label">
          {{row.name}}
        </span>
      </div>`
  };
};
