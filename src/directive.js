export var Directive = function(){
  return {
    restrict: 'E',
    controller: 'DataTable',
    scope: {
      options: '=',
      model: '='
    },
    template: 
      `<div class="dt material">
        <div class="dt-header">
          <div class="dt-row">
          </div>
        </div>
        <div class="dt-body">
          <div class="dt-scroller">
            <div class="dt-row">
              foo
            </div>
          </div>
        </div>
        <div class="dt-footer"></div>
      </div>`,
    link: function($scope, $elm, $attrs){
      console.log($scope.options)
    }
  };
};
