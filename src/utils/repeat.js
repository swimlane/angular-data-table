export var Repeater = function() {

  return {
    transclude: 'element',
    priority: 1000,
    compile: compileFun
  };

  function compileFun(element, attrs, linker) {
    var expression = attrs.repeater.split(' in ');
    expression = {
      child: expression[0],
      property: expression[1]
    };

    return {
      post: repeat
    };

    function repeat(scope, iele, iattrs) {
      var template = element[0].outerHTML;
      var data = scope.$eval(expression.property);
      addElements(data, scope, iele);

      return;

      function makeNewScope(index, expression, value, scope, collection) {
        var childScope = scope.$new();
        childScope[expression] = value;
        childScope.$index = index;
        childScope.$first = (index === 0);
        childScope.$last = (index === (collection.length - 1));
        childScope.$middle = !(childScope.$first || childScope.$last);

        /**
         *
         * uncomment this if you want your children to keep listening for changes
         * childScope.$watch(function updateChildScopeItem(){
         * childScope[expression] = value;
         * });
         **/

        return childScope;
      }

      function addElements(collection, scope, insPoint) {
        var frag = document.createDocumentFragment();
        var newElements = [],
          element, idx, childScope;

        angular.forEach(data, function(v, i) {
          childScope = makeNewScope(i, expression.child, v, scope, collection);
          element = linker(childScope, angular.noop);
          newElements.push(element);
          frag.appendChild(element[0]);
        });

        insPoint.after(frag);
        return newElements;
      }
    }
  }

});
