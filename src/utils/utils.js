export var ColumnsByPin = function(cols){
  var ret = {
    left: [],
    center: [],
    right: []
  };

  cols.forEach((c) => {
    if(c.frozenLeft){
      ret.left.push(c)
    } else if(c.frozenRight){
      ret.right.push(c);
    } else {
      ret.center.push(c);
    }
  });

  return ret;
};

// shim layer with setTimeout fallback
// http://www.html5rocks.com/en/tutorials/speed/animations/
export var requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          window.oRequestAnimationFrame      ||
          window.msRequestAnimationFrame     ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();
