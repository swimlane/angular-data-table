import angular from 'angular';

// Notes:
// http://stackoverflow.com/questions/14615534/custom-directive-like-ng-repeat

// width: 1200px; height: 50px; z-index: 0; transform: translate3d(0px, 21100px, 0px); backface-visibility: hidden;

export var RowController = function($scope){
};

export var RowDirective = function(){

  var createFrags = function(cols, data){
    var frag = document.createDocumentFragment();

    cols.forEach((c) => {
      var div = document.createElement("div");
      div.textContent = data[c.prop];
      frag.appendChild(div);
    });

    return frag;
  };

  var getCols = function(cols){
    var ret = {
      left: [],
      center: [],
      right: []
    }

    cols.forEach((c) => {
      if(c.frozenLeft){
        ret.left.push(c)
      } else if(c.frozenRight){
        ret.right.push(c);
      } else {
        ret.center.push(c);
      }
    });

    return ret;
  };

  return {
    restrict: 'E',
    controller: 'RowController',
    scope: {
      value: '=',
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
        post: function($scope, elm, attrs, controller) {
          var elms = elm[0].querySelectorAll(':scope > *'),
              cols = getCols($scope.columns);

          $scope.$watchCollection('value', (newVal, oldVal) => {
            if(newVal){
              var idx = 0;
              angular.forEach(cols, (c) => {
                elms[idx++].appendChild(createFrags(c, newVal));
              });
            }
          });
        }
      }
    }
  };
};
