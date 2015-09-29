import { ColumnTotalWidth } from './math';

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
 * Creates a unique object id.
 */
export function ObjectId() {
  var timestamp = (new Date().getTime() / 1000 | 0).toString(16);
  return timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, function () {
      return (Math.random() * 16 | 0).toString(16);
  }).toLowerCase();
};

/**
 * Returns the columns by pin.
 * @param {array} colsumns
 */
export function ColumnsByPin(cols){
  var ret = {
    left: [],
    center: [],
    right: []
  };

  for(var i=0, len=cols.length; i < len; i++) {
    var c = cols[i];
    if(c.frozenLeft){
      ret.left.push(c)
    } else if(c.frozenRight){
      ret.right.push(c);
    } else {
      ret.center.push(c);
    }
  }

  return ret;
};

/**
 * Returns the widths of all group sets of a column
 * @param {object} groups 
 * @param {array} all 
 */
export function ColumnGroupWidths(groups, all){
  return {
    left: ColumnTotalWidth(groups.left),
    center: ColumnTotalWidth(groups.center),
    right: ColumnTotalWidth(groups.right),
    total: ColumnTotalWidth(all)
  };
}

/**
 * Returns a deep object given a string. zoo['animal.type']
 * @param {object} obj  
 * @param {string} path 
 */
export function DeepValueGetter(obj, path) {
  if(!obj || !path) return obj;

  var current = obj,
      split = path.split('.');

  if(split.length){
    for(var i=0, len=split.length; i < len; i++) {
      current = current[split[i]]; 
    }
  }
  
  return current;
};

/**
 * Converts strings from something to camel case
 * http://stackoverflow.com/questions/10425287/convert-dash-separated-string-to-camelcase
 * @param  {string} str 
 * @return {string} camel case string
 */
export function CamelCase(str) {
  // Replace special characters with a space
  str = str.replace(/[^a-zA-Z0-9 ]/g, " ");
  // put a space before an uppercase letter
  str = str.replace(/([a-z](?=[A-Z]))/g, '$1 ');
  // Lower case first character and some other stuff
  str = str.replace(/([^a-zA-Z0-9 ])|^[0-9]+/g, '').trim().toLowerCase();
  // uppercase characters preceded by a space or number
  str = str.replace(/([ 0-9]+)([a-zA-Z])/g, function(a,b,c) {
      return b.trim()+c.toUpperCase();
  });
  return str;
};


/**
 * Gets the width of the scrollbar.  Nesc for windows
 * http://stackoverflow.com/a/13382873/888165
 * @return {int} width
 */
export function ScrollbarWidth() {
  var outer = document.createElement("div");
  outer.style.visibility = "hidden";
  outer.style.width = "100px";
  outer.style.msOverflowStyle = "scrollbar";
  document.body.appendChild(outer);

  var widthNoScroll = outer.offsetWidth;
  outer.style.overflow = "scroll";

  var inner = document.createElement("div");
  inner.style.width = "100%";
  outer.appendChild(inner);

  var widthWithScroll = inner.offsetWidth;
  outer.parentNode.removeChild(outer);

  return widthNoScroll - widthWithScroll;
};

export function NextSortDirection(sortType, currentSort) {
  if (sortType === 'single') {
    if(currentSort === 'asc'){
      return 'desc';
    } else {
      return 'asc';
    }
  } else {
    if(!currentSort){
      return 'asc';
    } else if(currentSort === 'asc'){
      return 'desc';
    } else if(currentSort === 'desc'){
      return undefined;
    }
  }
};
