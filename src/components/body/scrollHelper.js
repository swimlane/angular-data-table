/**
 * A helper for scrolling the body to a specific scroll position
 * when the footer pager is invoked.
 */
export class ScrollHelper {
  constructor(elm){
    this._elm = elm;
  }
  setYOffset(offsetY){
    this._elm[0].scrollTop = offsetY;
  }
};
