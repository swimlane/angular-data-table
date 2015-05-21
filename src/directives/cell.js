import angular from 'angular';

// data-title="Column Name"
 

export var CellController = function(){

};

export var CellDirective = function(){
  return {
    restrict: 'E',
    controller: 'CellController',
    scope: {
      text: '=',
      rowIndex: '='
    },
    template: 
      `<div class="dt-cell">
        cell
      </div>`,
    link: function($scope, $elm, $attrs){
      console.log('cell')
    }
  };
};
