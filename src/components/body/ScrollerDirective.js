import { requestAnimFrame } from '../../utils/utils';
import { scrollHelper } from './scrollHelper';

export function ScrollerDirective($timeout){
  return {
    restrict: 'E',
    controller: 'ScrollerController',
    controllerAs: 'scroller',
    bindToController: true,
    require:'^dtBody',
    transclude: true,
    template: `<div ng-style="scroller.scrollerStyles(this)" ng-transclude></div>`,
    link: function($scope, $elm, $attrs, ctrl){
      var ticking = false,
          lastScrollY = 0,
          lastScrollX = 0,
          helper = scrollHelper.create($elm);

      function update(){
        $timeout(() => {
          $scope.options.internal.offsetY = lastScrollY;
          $scope.options.internal.offsetX = lastScrollX;
          ctrl.updatePage();
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
    }
  };
};
