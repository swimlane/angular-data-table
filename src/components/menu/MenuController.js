export class MenuController{

  getColumnIndex(model){
    return this.current.findIndex((col) => {
      return model.name == col.name;
    });
  }

  isChecked(model){
    return this.getColumnIndex(model) > -1;
  }

  onCheck(model){
    var idx = this.getColumnIndex(model);
    if(idx === -1){
      this.current.push(model);
    } else {
      this.current.splice(idx, 1);
    }
  }

}
