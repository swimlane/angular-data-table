import { GroupRowController } from './GroupRowController';
import { TranslateXY } from '../../utils/translate';

export function GroupRowDirective(){
  return {
    restrict: 'E',
    controller: GroupRowController,
    controllerAs: 'group',
    bindToController: {
      row: '=',
      onGroupToggle: '&',
      expanded: '=',
      options: '='
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
      </div>`,
    link: function($scope, $elm, $attrs, ctrl){
      // inital render position
      TranslateXY($elm[0].style, 0, ctrl.row.$$index * ctrl.options.rowHeight);

      // register w/ the style translator
      ctrl.options.internal.styleTranslator.register($scope.$index, $elm);
    }
  };
};
