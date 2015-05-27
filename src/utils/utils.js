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

export var KeyCodes = {
  LEFTARROW: 37,
  UPARROW: 38,
  RIGHTARROW: 39,
  DOWNARROW: 40,
  ENTER: 13
};
