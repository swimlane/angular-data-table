import angular from 'angular';

export class GroupRowController {

  onGroupToggle(evt, scope){
    evt.stopPropagation();
    scope.onGroupToggle({
      group: scope.value
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

export function GroupRowDirective(){
  return {
    restrict: 'E',
    controller: 'GroupRowController',
    controllerAs: 'group',
    scope: {
      value: '=',
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
          {{value.name}}
        </span>
      </div>`
  };
};
