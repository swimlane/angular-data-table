/**
 * Shim layer with setTimeout fallback
 * http://www.html5rocks.com/en/tutorials/speed/animations/
 */
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

/**
 * Returns the columns by pin.
 */
export function ColumnsByPin(cols){
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

/**
 * Returns a deep object given a string. zoo['animal.type']
 */
export function DeepValueGetter(obj, path) {
  if(!obj) return obj;

  var current = obj,
      split = path.split('.');

  if(split.length){
    split.forEach((p) => { 
      current = current[p]; 
    }); 
  }
  
  return current;
};
