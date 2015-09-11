import { requestAnimFrame } from '../../utils/utils';
import { StyleTranslator } from './StyleTranslator';
import { TranslateXY } from '../../utils/translate';

export function ScrollerDirective($timeout){
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
        $scope.$applyAsync(() => {
          ctrl.options.internal.offsetY = lastScrollY;
          ctrl.options.internal.offsetX = lastScrollX;
          ctrl.updatePage();

          if(ctrl.options.scrollbarV){
            ctrl.getRows();
          }
        });
        
        ticking = false;
      };

      function requestTick() {
        if(!ticking) {
          requestAnimFrame(update);
          ticking = true;
        }
      };

      $elm.parent().on('scroll', function(ev) {
        lastScrollY = this.scrollTop;
        lastScrollX = this.scrollLeft;
        requestTick();
      });

      $scope.scrollerStyles = function(scope){
        return {
          height: ctrl.count * ctrl.options.rowHeight + 'px'
        }
      };

    }
  };
};
