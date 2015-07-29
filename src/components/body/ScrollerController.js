export class ScrollerController {

  /**
   * Returns the virtual row height.
   * @return {[height]}
   */
  scrollerStyles(scope){
    return {
      height: scope.count * scope.body.options.rowHeight + 'px'
    }
  }

}
