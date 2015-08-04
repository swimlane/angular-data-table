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
        <span ng-class="group.treeClass()"
              ng-click="group.onGroupToggle($event)">
        </span>
        <span class="dt-group-row-label">
          {{group.row.name}}
        </span>
      </div>`
  };
};
