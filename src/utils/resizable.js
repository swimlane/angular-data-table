// http://stackoverflow.com/questions/18368485/angular-js-resizable-div-directive

export function Resizable($document, debounce, $timeout){
  return {
    restrict: 'AEC',
    link: function($scope, $element, $attrs){
      var handle = angular.element(`<span class="dt-resize-handle"></span>`);

      handle.on('mousedown', function(event) {
        if(!$element[0].classList.contains('resizable')) {
          return false;
        }

        event.stopPropagation();
        event.preventDefault();

        $document.on('mousemove', mousemove);
        $document.on('mouseup', mouseup);
      });

      function mousemove(event) {
        var width = $element[0].scrollWidth;
        $element.css({
          width: (width + event.movementX) + 'px'
        });
      }

      function mouseup() {
        $timeout(() => {
          $scope.column.width = $element[0].scrollWidth;
        });

        $document.unbind('mousemove', mousemove);
        $document.unbind('mouseup', mouseup);
      }

      $element.append(handle);
    }
  };
};
