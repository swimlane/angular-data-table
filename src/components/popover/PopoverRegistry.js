/**
 * Registering to deal with popovers
 * @param {function} $animate
 */
export function PopoverRegistry($animate){
  var popovers = {};
  this.add = function(id, object){
    popovers[id] = object;
  }
  this.find = function(id){
    popovers[id];
  }
  this.remove = function(id){
    delete popovers[id];
  }
  this.removeGroup = function(group, currentId){
    angular.forEach(popovers, function(popoverOb, id){
      if (id === currentId) return;

      if (popoverOb.group && popoverOb.group === group){
        $animate.removeClass(popoverOb.popover, 'sw-popover-animate').then(() => {
          popoverOb.popover.remove();
          delete popovers[id];
        });
      }
    });
  }
};
