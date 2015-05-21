export var Resize = function($document) {
  return function($scope, $element, $attrs) {

    $element.on('mousedown', function(event) {
      event.preventDefault();

      $document.on('mousemove', mousemove);
      $document.on('mouseup', mouseup);
    });

    function mousemove(event) {

      if ($attrs.resizer == 'vertical') {
        // Handle vertical resizer
        var x = event.pageX;

        if ($attrs.resizerMax && x > $attrs.resizerMax) {
          x = parseInt($attrs.resizerMax);
        }

        $element.css({
          left: x + 'px'
        });

        angular.element($attrs.resizerLeft).css({
          width: x + 'px'
        });

        angular.element($attrs.resizerRight).css({
          left: (x + parseInt($attrs.resizerWidth)) + 'px'
        });

      } else {
        // Handle horizontal resizer
        var y = window.innerHeight - event.pageY;

        $element.css({
          bottom: y + 'px'
        });

        angular.element($attrs.resizerTop).css({
          bottom: (y + parseInt($attrs.resizerHeight)) + 'px'
        });

        angular.element($attrs.resizerBottom).css({
          height: y + 'px'
        });
      }
    }

    function mouseup() {
      $document.unbind('mousemove', mousemove);
      $document.unbind('mouseup', mouseup);
    }
  };
};
