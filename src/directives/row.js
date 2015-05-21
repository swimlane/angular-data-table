import angular from 'angular';

// Notes:
// http://stackoverflow.com/questions/14615534/custom-directive-like-ng-repeat

// width: 1200px; height: 50px; z-index: 0; transform: translate3d(0px, 21100px, 0px); backface-visibility: hidden;

export var RowController = function($scope){
};

export var RowDirective = function(){
  return {
    restrict: 'E',
    controller: 'RowController',
    scope: {
      data: '=',
      columns: '=',
      index: '='
    },
    template: `
      <div class="dt-row">
        <div class="dt-row-left"></div>
        <div class="dt-row-center"></div>
        <div class="dt-row-right"></div>
      </div>`,
    replace:true,
    compile : function(tElement, tAttrs, transclude) {
      return {
        post: function (scope, elm, attrs, controller) {
          var template = elm[0].outerHTML;

          scope.$watch('data', function(newVal, oldVal) {

            var frag = document.createDocumentFragment();

            var div = document.createElement("div");
            div.textContent = 'panda';
            frag.appendChild(div);

            elm[0].appendChild(frag);

          });
        }
      }
    }
  };
};
