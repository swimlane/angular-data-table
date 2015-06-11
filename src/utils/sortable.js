import angular from 'angular';

/**
 * Sortable Directive
 * http://jsfiddle.net/RubaXa/zLq5J/3/
 * https://jsfiddle.net/hrohxze0/6/
 * @param {function}
 */
export function Sortable($timeout) {
  return {
    restrict: 'AC',
    scope: {
      isSortable: '=sortable',
      onSortableSort: '&'
    },
    link: function($scope, $element, $attrs){
      var rootEl = $element[0], dragEl, nextEl, dropEl;

      $timeout(() => {
        angular.forEach(rootEl.children, (el) => {
          el.draggable = true;
        });
      });

      function isbefore(a, b) {
        if (a.parentNode == b.parentNode) {
          for (var cur = a; cur; cur = cur.previousSibling) {
            if (cur === b) { 
              return true;
            }
          }
        }
        return false;
      };

      function onDragEnter(e) {
        var target = e.target;
        if (isbefore(dragEl, target)) {
          target.parentNode.insertBefore(dragEl, target);
        } else if(target.nextSibling && target.hasAttribute('draggable')) {
          target.parentNode.insertBefore(dragEl, target.nextSibling);
        }
      };

      function onDragEnd(evt) {
        evt.preventDefault();

        dragEl.classList.remove('dt-clone');

        $element.off('dragend', onDragEnd);
        $element.off('dragenter', onDragEnter);

        if (nextEl !== dragEl.nextSibling) {
          $scope.onSortableSort({ 
            event: evt, 
            childScope: angular.element(dragEl).scope() 
          });
        }
      };

      function onDragStart(evt){
        if(!$scope.isSortable) return false;

        dragEl = evt.target;
        nextEl = dragEl.nextSibling;
        dragEl.classList.add('dt-clone');

        evt.dataTransfer.effectAllowed = 'move';
        evt.dataTransfer.setData('Text', dragEl.textContent);

        $element.on('dragenter', onDragEnter);
        $element.on('dragend', onDragEnd);
      };

      $element.on('dragstart', onDragStart);

      $scope.$on('$destroy', () => {
        $element.off('dragstart', onDragStart);
      });
    }
  }
}
