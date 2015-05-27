import angular from 'angular';

// http://jsfiddle.net/RubaXa/zLq5J/3/
export function Sortable($timeout) {
  return {
    restrict: 'AC',
    scope: {
      isSortable: '=sortable',
      onSort: '&'
    },
    link: function($scope, $element, $attrs){
      var rootEl = $element[0], dragEl, nextEl;

      $timeout(() => {
        angular.forEach(rootEl.children, (el) => {
          el.draggable = true;
        });
      });

      function onDragOver(evt) {
        evt.preventDefault();
        evt.dataTransfer.dropEffect = 'move';
        var target = evt.target;

        if (target && target !== dragEl && target.hasAttribute('draggable')) {
          rootEl.insertBefore(dragEl, rootEl.children[0] !== target && target.nextSibling || target);
        }
      };

      function onDragEnter(e) {
        var target = e.target;
        if(target.hasAttribute('draggable')){
          target.classList.add('dt-drag-over');
        }
      };

      function onDragLeave(e) {
        var target = e.target;
        if(target.hasAttribute('draggable')){
          target.classList.remove('dt-drag-over');
        }
      };

      function onDragEnd(evt) {
        evt.preventDefault();

        dragEl.classList.remove('dt-clone');
        $element.off('dragover', onDragOver);
        $element.off('dragend', onDragEnd);

        if (nextEl !== dragEl.nextSibling) {
          $scope.onSort({ 
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

        //evt.dataTransfer.effectAllowed = 'move';
        evt.dataTransfer.effectAllowed = 'copyMove';
        evt.dataTransfer.setData('Text', dragEl.textContent);

        $element.on('dragover', onDragOver);
        $element.on('dragend', onDragEnd);
        //$element.on('dragenter', onDragEnter);
        //$element.on('dragleave', onDragLeave);
      };

      $element.on('dragstart', onDragStart);
    }
  }
}
