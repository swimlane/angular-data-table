(function(){
  "use strict";

  angular.module('pages')
   .directive('codepen', ['$sce',
      CodepenDirective
   ]);

  function CodepenDirective($sce) {
    return {
      restrict: 'AE',
      templateUrl: './src/components/codepen/codepen.html',
      scope: {
        codepenId: '='
      },
      link: function($scope, el, attributes){
        console.log(arguments);

        $scope.render = function(){
          $scope.codepenUrl = $sce.trustAsResourceUrl('//codepen.io/marjan-georgiev/embed/' + $scope.codepenId +  '/?height=600&theme-id=0&default-tab=result');
        }

        $scope.render();

        $scope.$watch('codepenId', function(){
          console.log($scope.codepenId);
          $scope.render();
        });
      }
    };

  }

})();
