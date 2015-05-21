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
