import { TranslateXY } from '../../utils/translate';

/**
 * This translates the dom position based on the model row index.
 * This only exists because Angular's binding process is too slow.
 */
export class StyleTranslator{

  constructor(height){
    this.height = height;
    this.map = new Map();
  }

  /**
   * Update the rows
   * @param  {Array} rows
   */
  update(rows){
    let n = 0;
    while (n <= this.map.size) {
      let dom = this.map.get(n);
      let model = rows[n];
      if(dom && model){
        TranslateXY(dom[0].style, 0, model.$$index * this.height);
      }
      n++;
    }
  }

  /**
   * Register the row
   * @param  {int} idx
   * @param  {dom} dom
   */
  register(idx, dom){
    this.map.set(idx, dom);
  }

}
