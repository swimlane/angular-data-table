/**
 * Position helper for the popover directive.
 */
export function PositionHelper(){
  return {

    calculateVerticalAlignment: function(elDimensions, popoverDimensions, alignment){
      if (alignment === 'top'){
        return elDimensions.top;
      }
      if (alignment === 'bottom'){
        return elDimensions.top + elDimensions.height - popoverDimensions.height;
      }
      if (alignment === 'center'){
        return elDimensions.top + elDimensions.height/2 - popoverDimensions.height/2;
      }
    },

    calculateVerticalCaret: function(elDimensions, popoverDimensions, caretDimensions, alignment){
      if (alignment === 'top'){
        return elDimensions.height/2 - caretDimensions.height/2 - 1;
      }
      if (alignment === 'bottom'){
        return popoverDimensions.height - elDimensions.height/2 - caretDimensions.height/2 - 1;
      }
      if (alignment === 'center'){
        return popoverDimensions.height/2 - caretDimensions.height/2 - 1;
      }
    },

    calculateHorizontalCaret: function(elDimensions, popoverDimensions, caretDimensions, alignment){
      if (alignment === 'left'){
        return elDimensions.width/2 - caretDimensions.height/2 - 1;
      }
      if (alignment === 'right'){
        return popoverDimensions.width - elDimensions.width/2 - caretDimensions.height/2 - 1;
      }
      if (alignment === 'center'){
        return popoverDimensions.width/2 - caretDimensions.height/2 - 1;
      }
    },

    calculateHorizontalAlignment: function(elDimensions, popoverDimensions, alignment){
      if (alignment === 'left'){
        return elDimensions.left;
      }
      if (alignment === 'right'){
        return elDimensions.left + elDimensions.width - popoverDimensions.width;
      }
      if (alignment === 'center'){
        return elDimensions.left + elDimensions.width/2 - popoverDimensions.width/2;
      }
    }

  }
};
