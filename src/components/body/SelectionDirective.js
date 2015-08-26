import { KEYS } from '../../utils/keys';

class SelectionController {

  constructor(){
    debugger;
  }


  /**
   * Returns if the row is selected
   * @param  {row}
   * @return {Boolean}
   */
  isSelected(row){
    var selected = false;

    if(this.options.selectable){
      if(this.options.multiSelect){
        selected = this.selected.indexOf(row) > -1;
      } else {
        selected = this.selected === row;
      }
    }

    return selected;
  }

  /**
   * Handler for the keydown on a row
   * @param  {event}
   * @param  {index}
   * @param  {row}
   */
  keyDown(ev, index, row){
    ev.preventDefault();

    if (ev.keyCode === KEYS.DOWN) {
      var next = ev.target.nextElementSibling;
      if(next){
        next.focus();
      }
    } else if (ev.keyCode === KEYS.UP) {
      var prev = ev.target.previousElementSibling;
      if(prev){
        prev.focus();
      }
    } else if(ev.keyCode === KEYS.RETURN){
      this.selectRow(index, row);
    }
  }

  /**
   * Handler for the row click event
   * @param  {object} event
   * @param  {int} index
   * @param  {object} row
   */
  rowClicked(event, index, row){
    if(!this.options.checkboxSelection){
      event.preventDefault();
      this.selectRow(event, index, row);
    }

    this.onRowClick({ row: row });
  }


  /**
   * Selects a row and places in the selection collection
   * @param  {index}
   * @param  {row}
   */
  selectRow(event, index, row){
    if(this.options.selectable){
      if(this.options.multiSelect){
        var isCtrlKeyDown = event.ctrlKey || event.metaKey,
            isShiftKeyDown = event.shiftKey;

        if(isShiftKeyDown){
          this.selectRowsBetween(index, row);
        } else {
          var idx = this.selected.indexOf(row);
          if(idx > -1){
            this.selected.splice(idx, 1);
          } else {
            if(this.options.multiSelectOnShift && this.selected.length === 1) {
              this.selected.splice(0, 1);
            }
            this.selected.push(row);
            this.onSelect({ rows: [ row ] });
          }
        }
        this.prevIndex = index;
      } else {
        this.selected = row;
        this.onSelect({ rows: [ row ] });
      }
    }
  }

  /**
   * Selects the rows between a index.  Used for shift click selection.
   * @param  {index}
   */
  selectRowsBetween(index){
    var reverse = index < this.prevIndex,
        selecteds = [];

    for(var i=0, len=this.tempRows.length; i < len; i++) {
      var row = this.tempRows[i],
          greater = i >= this.prevIndex && i <= index,
          lesser = i <= this.prevIndex && i >= index;

      var range = {};
      if ( reverse ) {
        range = {
          start: index,
          end: ( this.prevIndex - index )
        }
      } else {
        range = {
          start: this.prevIndex,
          end: index + 1
        }
      }

      if((reverse && lesser) || (!reverse && greater)){
        var idx = this.selected.indexOf(row);
        // if reverse shift selection (unselect) and the
        // row is already selected, remove it from selected
        if ( reverse && idx > -1 ) {
          this.selected.splice(idx, 1);
          continue;
        }
        // if in the positive range to be added to `selected`, and
        // not already in the selected array, add it
        if( i >= range.start && i < range.end ){
          if ( idx === -1 ) {
            this.selected.push(row);
            selecteds.push(row);
          }
        }
      }
    }

    this.onSelect({ rows: selecteds });
  }
}

export function SelectionDirective($timeout){
  return {
    controller: SelectionController,
    restrict: 'E',
    require:'^dtBody'
  };
};
