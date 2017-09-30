export class Cell {
  constructor(map, x, y, z){
    this.map = map;
    this.x = x;
    this.y = y;
    this.z = z;
    this.fillStyle = this.map.fillStyle;
    this.strokeStyle = "#ffffff";
    this.lineWidth = 1;
    this.highlight = false;
    this.highlightStyle = "#ff0000";
  }
  render(ctx, stroke=true, cellWidth=this.map.cellWidth, cellHeight=this.map.cellHeight){
    if(!ctx){
      ctx = this.map.canvas.getContext("2d");
    }
    ctx.lineWidth = this.lineWidth;
    ctx.globalCompositeOperation = "source-over";
    if(this.highlight){
      ctx.fillStyle = this.highlightStyle;
    } else {
      ctx.fillStyle = this.map.gridColor;
    }
    ctx.fillRect(this.x * cellWidth, this.y * cellHeight, cellWidth + 1, cellHeight + 1);
    ctx.fillStyle = this.fillStyle;
    ctx.strokeStyle = this.strokeStyle;
    ctx.fillRect(this.x * cellWidth + 1, this.y * cellHeight + 1, cellWidth - 1, cellHeight - 1);
    if(stroke){
      ctx.stroke();
    }
  }
}
