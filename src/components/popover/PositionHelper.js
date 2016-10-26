/**
 * Position helper for the popover directive.
 */

import { POSITION } from './Popover.constants';

export function PositionHelper(){
  return {

    calculateVerticalAlignment: function(elDimensions, popoverDimensions, alignment){
      if (alignment === POSITION.TOP){
        return elDimensions.top;
      }
      if (alignment === POSITION.BOTTOM){
        return elDimensions.top + elDimensions.height - popoverDimensions.height;
      }
      if (alignment === POSITION.CENTER){
        return elDimensions.top + elDimensions.height/2 - popoverDimensions.height/2;
      }
    },

    calculateVerticalCaret: function(elDimensions, popoverDimensions, caretDimensions, alignment){
      if (alignment === POSITION.TOP){
        return elDimensions.height/2 - caretDimensions.height/2 - 1;
      }
      if (alignment === POSITION.BOTTOM){
        return popoverDimensions.height - elDimensions.height/2 - caretDimensions.height/2 - 1;
      }
      if (alignment === POSITION.CENTER){
        return popoverDimensions.height/2 - caretDimensions.height/2 - 1;
      }
    },

    calculateHorizontalCaret: function(elDimensions, popoverDimensions, caretDimensions, alignment){
      if (alignment === POSITION.LEFT){
        return elDimensions.width/2 - caretDimensions.height/2 - 1;
      }
      if (alignment === POSITION.RIGHT){
        return popoverDimensions.width - elDimensions.width/2 - caretDimensions.height/2 - 1;
      }
      if (alignment === POSITION.CENTER){
        return popoverDimensions.width/2 - caretDimensions.height/2 - 1;
      }
    },

    calculateHorizontalAlignment: function(elDimensions, popoverDimensions, alignment){
      if (alignment === POSITION.LEFT){
        return elDimensions.left;
      }
      if (alignment === POSITION.RIGHT){
        return elDimensions.left + elDimensions.width - popoverDimensions.width;
      }
      if (alignment === POSITION.CENTER){
        return elDimensions.left + elDimensions.width/2 - popoverDimensions.width/2;
      }
    }

  }
};
