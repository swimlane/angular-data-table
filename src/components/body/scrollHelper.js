/**
 * A helper for scrolling the body to a specific scroll position
 * when the footer pager is invoked.
 */
export var scrollHelper = function(){
  var _elm;
  return {
    create: function(elm){
      _elm = elm;
    },
    setYOffset: function(offsetY){
      _elm[0].scrollTop = offsetY;
    }
  }
}();
