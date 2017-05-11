class Cell {
  constructor(x, y, cellWidth, cellHeight){
    this.x = x;
    this.y = y;
    this.cellWidth = cellWidth;
    this.cellHeight = cellHeight;
    this.wall = {top: true, bottom: true, left: true, right: true};
    this.fillStyle = "#d0d0d0";
    this.strokeStyle = "#000000";
    this.lineWidth = 1;
  }
  render(ctx, stroke=true){
    ctx.lineWidth = this.lineWidth;
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = this.fillStyle;
    ctx.fillRect(this.x * this.cellWidth, this.y * this.cellHeight, this.cellWidth, this.cellHeight);

    ctx.strokeStyle = this.strokeStyle;
    if(this.wall.top){
      ctx.moveTo(this.x * this.cellWidth, this.y * this.cellHeight);
      ctx.lineTo(this.x * this.cellWidth + this.cellWidth, this.y * this.cellHeight);
    }
    if(this.wall.bottom){
      ctx.moveTo(this.x * this.cellWidth, this.y * this.cellHeight + this.cellHeight);
      ctx.lineTo(this.x * this.cellWidth + this.cellWidth, this.y * this.cellHeight + this.cellHeight);
    }
    if(this.wall.left){
      ctx.moveTo(this.x * this.cellWidth, this.y * this.cellHeight);
      ctx.lineTo(this.x * this.cellWidth, this.y * this.cellHeight + this.cellHeight);
    }
    if(this.wall.right){
      ctx.moveTo(this.x * this.cellWidth + this.cellWidth, this.y * this.cellHeight);
      ctx.lineTo(this.x * this.cellWidth + this.cellWidth, this.y * this.cellHeight + this.cellHeight);
    }
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

    this.data = [];
    //for(var i = 0; i < this.height; ++i){
    //  var d = [];
    //  for(var j = 0; j < this.width; ++j){
    //    d.push(new Cell(i, j, this.cellWidth, this.cellHeight));
    //  }
    //  this.data.push(d);
    //}
    target.append(this.canvas);
    this.drawGrid();
  }

  drawGrid(){
    var ctx = this.canvas.getContext("2d");
    ctx.globalCompositeOperation = "copy";
    ctx.beginPath();
    ctx.moveTo(this.translation.x, this.translation.y);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    for(var i = 0; i < this.height + 1; ++i){
      ctx.moveTo(-this.translation.x, -this.translation.y + i * this.cellHeight)
      ctx.lineTo(-this.translation.x + this.width*this.cellWidth, -this.translation.y +  i* this.cellHeight);
    }
    for(var i = 0; i < this.width + 1; ++i){
      ctx.moveTo(-this.translation.x + i * this.cellWidth, -this.translation.y)
      ctx.lineTo(-this.translation.x + i * this.cellWidth, -this.translation.y + this.cellHeight * this.height);
    }
    ctx.stroke();
  }

  getCell(x, y){
    var key = x + "/" + y;
    if(this.data[key]){
      return this.data[key];
    }else{
      this.data[key] = new Cell(x, y, this.cellWidth, this.cellHeight);
      return this.data[key];
    }
  }

  render(){
    var ctx = this.canvas.getContext("2d");
    ctx.globalCompositeOperation = "source-over";
    ctx.beginPath();
    ctx.moveTo(0,0);
    for(var i = 0; i < this.height; ++i){
      for(var j = 0; j < this.width; ++j){
        var x = this.translation.x/this.cellWidth + j;
        var y = this.translation.y/this.cellHeight + i;
        var key = x + "/" + y;
        if(this.data[key]){
          this.data[key].render(ctx, true);
        }
      }
    }
    ctx.stroke();
  }
  on(trigger, action){
    $(this.canvas).on(trigger, action);
  }

  translate(x, y){
    this.translation.x = this.translation.x + x;
    this.translation.y = this.translation.y + y;
    this.canvas.getContext("2d").translate(x,y);
    this.drawGrid();
    this.render();
  }

}
