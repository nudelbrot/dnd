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

    this.data = [];
    for(var i = 0; i < this.height; ++i){
      var d = [];
      for(var j = 0; j < this.width; ++j){
        d.push(new Cell(i, j, this.cellWidth, this.cellHeight));
      }
      this.data.push(d);
    }
    target.append(this.canvas);
    this.render();
  }

  render(){
    var ctx = this.canvas.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(0,0);
    for(var i = 0; i < this.height; ++i){
      for(var j = 0; j < this.width; ++j){
        this.data[i][j].render(ctx, false);
      }
    }
    ctx.closePath();
    ctx.stroke();
  }
  on(trigger, action){
    $(this.canvas).on(trigger, action);
  }

}
