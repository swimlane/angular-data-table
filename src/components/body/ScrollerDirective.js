import { requestAnimFrame } from '../../utils/utils';
import { StyleTranslator } from './StyleTranslator';
import { TranslateXY } from '../../utils/translate';

export function ScrollerDirective($timeout, $rootScope){
  return {
    restrict: 'E',
    require:'^dtBody',
    transclude: true,
    replace: true,
    template: `<div ng-style="scrollerStyles()" ng-transclude></div>`,
    link: function($scope, $elm, $attrs, ctrl){
      var ticking = false,
          lastScrollY = 0,
          lastScrollX = 0,
          parent = $elm.parent();

      ctrl.options.internal.styleTranslator =
        new StyleTranslator(ctrl.options.rowHeight);

      ctrl.options.internal.setYOffset = function(offsetY){
        parent[0].scrollTop = offsetY;
      };

      function update(){
        ctrl.options.internal.offsetY = lastScrollY;
        ctrl.options.internal.offsetX = lastScrollX;
        ctrl.updatePage();

        if(ctrl.options.scrollbarV){
          ctrl.getRows();
        }

        // https://github.com/Swimlane/angular-data-table/pull/74
        ctrl.options.$outer.$digest();

        ticking = false;
      };

      function requestTick() {
        if(!ticking) {
          requestAnimFrame(update);
          ticking = true;
        }
      };

      parent.on('scroll', function(ev) {
        lastScrollY = this.scrollTop;
        lastScrollX = this.scrollLeft;
        requestTick();
      });

      $scope.$on('$destroy', () => {
        parent.off('scroll');
      });

      $scope.scrollerStyles = function(){
        if(ctrl.options.scrollbarV){
          return {
            height: ctrl.count * ctrl.options.rowHeight + 'px'
          }
        }
      };

    }
  };
};
