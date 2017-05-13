class Cell {
  constructor(map, x, y, cellWidth, cellHeight){
    this.map = map;
    this.x = x;
    this.y = y;
    this.cellWidth = cellWidth;
    this.cellHeight = cellHeight;
    this.fillStyle = this.map.fillStyle;
    this.strokeStyle = "#ffffff";
    this.lineWidth = 1;
    this.highlight = false;
    this.highlightStyle = "#ff0000"
  }
  render(stroke=true){
    var ctx = this.map.canvas.getContext("2d");
    ctx.lineWidth = this.lineWidth;
    ctx.globalCompositeOperation = "source-over";
    if(this.highlight){
        ctx.fillStyle = this.highlightStyle;
    } else {
        ctx.fillStyle = this.map.fillStyle;
    }
    ctx.fillRect(this.x * this.cellWidth, this.y * this.cellHeight, this.cellWidth + 1, this.cellHeight + 1);
    ctx.fillStyle = this.fillStyle;
    ctx.strokeStyle = this.strokeStyle;
    ctx.fillRect(this.x * this.cellWidth + 1, this.y * this.cellHeight + 1, this.cellWidth - 1, this.cellHeight - 1);
    if(stroke){
        ctx.stroke();
    }
  }
}

class RectMap {
  constructor(target, width, height, cellWidth, cellHeight) {
    this.canvas = $("<canvas></canvas>")[0];
    this.canvas.width = width * cellWidth; 
    this.canvas.height = height * cellHeight; 

    var ctx = this.canvas.getContext("2d");
    ctx.canvas.width = width * cellWidth; 
    ctx.canvas.height = height * cellHeight; 
    this.width = width;
    this.height = height;
    this.cellWidth = cellWidth? cellWidth : 64;
    this.cellHeight = cellHeight? cellHeight : 64;
    this.translation = {x: 0, y: 0};
    this.scaleLevel = 1.0;
    this.fillStyle = "#ffffff";

    this.data = [];
    this.panel = $("<div class='panel panel-default col-md-6'></div>");
    var body = $("<div class='panel-body'></div>");
    body.append(this.canvas);
    this.panel.append(body);
    target.append(this.panel[0]);
  }

  getCell(x, y){
    var key = x + "/" + y;
    if(this.data[key]){
      return this.data[key];
    }else{
      this.data[key] = new Cell(this, x, y, this.cellWidth, this.cellHeight);
      return this.data[key];
    }
  }

  isCell(x, y){
    var key = x + "/" + y;
    return key in this.data;
  }

  scale(mode){
    //this.canvas.getContext("2d").scale(1/this.scaleLevel, 1/this.scaleLevel);
    //if(mode == "in"){
    // this.scaleLevel += 0.1;
    //}else if(mode == "out"){
    // this.scaleLevel -= 0.1;
    //}else{
    // this.scaleLevel = 1;
    //}
    //var scaledTranslation = {x: Math.floor(this.translation.x / this.scaleLevel), y: Math.floor(this.translation.y / this.scaleLevel)};
    //this.translate(-this.translation.x, -this.translation.y);
    //this.canvas.getContext("2d").scale(this.scaleLevel, this.scaleLevel);
    //this.translate(scaledTranslation.x, scaledTranslation.y);

    //this.drawGrid();
    //this.render();
    //console.debug(this.scaleLevel, this.translation);
  }

  render(){
    var ctx = this.canvas.getContext("2d");
    ctx.globalCompositeOperation = "copy";
    ctx.rect(0,0,0,0);
    ctx.stroke();
    ctx.moveTo(0,0);
    for(var i = 0; i < this.height; ++i){
      for(var j = 0; j < this.width; ++j){
        var x = j - this.translation.x/this.cellWidth;
        var y =  i - this.translation.y/this.cellHeight;
        var key = x + "/" + y;
        if(this.data[key]){
          this.data[key].render(false);
        }
      }
    }
    ctx.stroke();
    if(this.onRenderFunction){
      this.onRenderFunction();
    }
  }

  on(trigger, action){
    if(trigger == "render"){
      this.onRenderFunction = action;
    }else{
      $(this.canvas).on(trigger, action);
    }
  }

  translate(x, y){
    this.translation.x = this.translation.x + x;
    this.translation.y = this.translation.y + y;
    this.canvas.getContext("2d").translate(x,y);
    this.render();
  }

}
