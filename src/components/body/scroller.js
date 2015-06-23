import { requestAnimFrame } from '../../utils/utils';

export class ScrollerController {

  /**
   * Returns the virtual row height.
   * @return {[height]}
   */
  scrollerStyles(scope){
    return {
      height: scope.count * scope.options.rowHeight + 'px'
    }
  }

}

/**
 * A helper for scrolling the body to a specific scroll position
 * when the footer pager is invoked.
 */
export var ScrollHelper = function(){
  var _elm;
  return {
    create: function(elm){
      _elm = elm;
    },
    setYOffset: function(offsetY){
      _elm[0].scrollTop = offsetY;
    }
  }
}();

export function ScrollerDirective($timeout){
  return {
    restrict: 'E',
    controller: 'ScrollerController',
    controllerAs: 'scroller',
    require:'^dtBody',
    transclude: true,
    template: `<div ng-style="scroller.scrollerStyles(this)" ng-transclude></div>`,
    link: function($scope, $elm, $attrs, ctrl){
      var ticking = false,
          lastScrollY = 0,
          lastScrollX = 0,
          helper = ScrollHelper.create($elm);

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
