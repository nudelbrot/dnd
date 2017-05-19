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
  render(ctx, stroke=true){
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
    this.gridColor = "#aaaaaa";
    this.fillStyle = "#eeeeee";

    this.data = []
    this.panel = $("<div class='panel panel-default col-md-6'></div>");
    var body = $("<div class='panel-body'></div>");
    body.append(this.canvas);
    this.panel.append(body);
    target.append(this.panel[0]);
    this.render();
  }

  getCell(x, y) {
    var key = x + "/" + y;
    if(this.data[key]){
      return this.data[key];
    }else{
      this.data[key] = new Cell(this, x, y, this.cellWidth, this.cellHeight);
      return this.data[key];
    }
  }

  isCell(x, y) {
    var key = x + "/" + y;
    return key in this.data;
  }

  removeCell(x, y) {
      var key = x + "/" + y;
      var ctx = this.canvas.getContext("2d");
      ctx.clearRect(x * this.cellWidth, y * this.cellHeight, this.cellWidth + 1, this.cellHeight + 1)
    this.data[key] = undefined;
    delete this.data[key];
  }

  changeCellFillstyle(x,y, fillStyle, render){
      var cell = this.getCell(x, y);
      cell.fillStyle = fillStyle;
      if (render){
          cell.render()
          if(this.onRenderFunction){
            this.onRenderFunction();
          }
      }
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

  render(ctx){
    if(!ctx){
      ctx = this.canvas.getContext("2d");
    }
    ctx.globalCompositeOperation = "copy";
    ctx.fillRect(0,0,0,0);
    ctx.stroke();

    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = this.gridColor;
    ctx.fillRect(-this.translation.x, -this.translation.y, this.width * this.cellWidth, this.height * this.cellHeight);
    ctx.stroke();
    ctx.moveTo(0,0);
    ctx.globalCompositeOperation = "source-over";
    for(var i = 0; i < this.height; ++i){
      for(var j = 0; j < this.width; ++j){
        var x = j - this.translation.x/this.cellWidth;
        var y =  i - this.translation.y/this.cellHeight;
        var key = x + "/" + y;
        if(this.isCell(x,y)){
          this.data[key].render(ctx, false);
        }else{
          ctx.fillStyle = this.fillStyle;
          ctx.fillRect(x * this.cellWidth + 1, y * this.cellHeight + 1, this.cellWidth - 1, this.cellHeight - 1);
          //ctx.stroke();
        }
      }
    }
    ctx.stroke();
    if(this.onRenderFunction){
      this.onRenderFunction();
    }
  }

  

  toJson(){
    var data = {fs: this.fillStyle, data: []}
    for(var k in this.data){
      if(this.data[k] && typeof(this.data[k]) != "function"){
        var c = this.data[k];
        data.data.push({x: c.x, y: c.y, fs: c.fillStyle});
      }
    }
    var url = 'data:text/json;charset=utf8,' + encodeURIComponent(JSON.stringify(data));
    var a = $("#saveJSON")[0];
    a.setAttribute("href", url)
    a.setAttribute("download", "map.json")

  }

  fromJson(json){
    this.fillStyle = json.fs;
    for(var c in json.data){
      var cell = json.data[c];
      this.getCell(cell.x, cell.y).fillStyle = cell.fs;
    }
    this.render();
  }

  toPNG(minX = -Number.MAX_VALUE, minY = -Number.MAX_VALUE, maxX = Number.MAX_VALUE, maxY = Number.MAX_VALUE){
    var canvas = $("<canvas></canvas>");
    var ctx = canvas[0].getContext("2d");
    var viewport = {minX: Number.MAX_VALUE, minY: Number.MAX_VALUE, maxX: -Number.MAX_VALUE, maxY: -Number.MAX_VALUE }
    for(var k in this.data){
      if(this.data[k] && typeof(this.data[k]) != "function"){
        var cell = this.data[k];
        viewport.minX = Math.min(viewport.minX, cell.x);
        viewport.maxX = Math.max(viewport.maxX, cell.x);
        viewport.minY = Math.min(viewport.minY, cell.y);
        viewport.maxY = Math.max(viewport.maxY, cell.y);
      }
    }
    ctx.canvas.width = (viewport.maxX - viewport.minX + 1)*this.cellWidth;
    ctx.canvas.height = (viewport.maxY - viewport.minY + 1)*this.cellHeight;
    ctx.translate(-viewport.minX * this.cellWidth, -viewport.minY * this.cellHeight);
    for(var k in this.data){
      if(this.data[k] && typeof(this.data[k]) != "function"){
        var cell = this.data[k];
        if(cell.x <= maxX && cell.x >= minX && cell.y <= maxY && cell.y >= minY){
          cell.render(ctx, false);
        }
      }
    }
    console.debug(minX, maxX, minY, maxY, viewport);
    ctx.stroke();
    var url = canvas[0].toDataURL("image/png");
    var a = $("#exportPNG")[0];
    a.setAttribute("href", url)
    //a.setAttribute("target", "_blank")
    a.setAttribute("download", "map.png")

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
