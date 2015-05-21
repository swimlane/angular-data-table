import angular from 'angular';
import { ColumnTotalWidth } from 'utils/math';

// Notes:
// http://stackoverflow.com/questions/14615534/custom-directive-like-ng-repeat

export var BodyController = function($scope){

  $scope.limit = 50;

  $scope.styles = {
    width: ColumnTotalWidth($scope.columns)
  }
};

export var BodyDirective = function(){

  var createFrags = function(cols, data){
    var frag = document.createDocumentFragment();

    data.forEach((d) => {
      cols.forEach((c) => {
        var div = document.createElement("div");
        div.textContent = d[c];
        frag.appendChild(div);
      });
    });

    return frag;
  };

  return {
    restrict: 'E',
    controller: 'BodyController',
    scope: {
      values: '=',
      columns: '='
    },
    template: `
      <div class="dt-body">
        <dt-row ng-repeat="r in values track by $index | limitTo: limit" 
                value="r" 
                columns="columns"
                ng-style="styles">
        </dt-row>
      </div>`,
    replace:true,
    compile : function(tElement, tAttrs, transclude) {
      return {
        post: function($scope, elm, attrs, controller) {

          $scope.$watchCollection('values', (newVal, oldVal) => {
            console.log('collection updated');
          });
        }
      }
    }
  };
};
