export function GroupRowDirective(){
  return {
    restrict: 'E',
    controller: 'GroupRowController',
    controllerAs: 'group',
    bindToController: {
      row: '=',
      onGroupToggle: '&',
      expanded: '='
    },
    scope: true,
    replace:true,
    template: `
      <div class="dt-group-row">
        <span ng-class="group.treeClass()"
              ng-click="group.onGroupToggled($event)">
        </span>
        <span class="dt-group-row-label" ng-bind="group.row.name">
        </span>
      </div>`
  };
};
