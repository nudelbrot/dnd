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
  constructor(target, cellWidth=24, cellHeight=24) {
    this.canvas = $("<canvas></canvas>")[0];
    var t = this;
    this.width = function(){return Math.floor($(target).width()/cellWidth);}
    this.height = function(){return Math.floor(($(window).height()-$(target).offset().top - 10)/cellHeight);}

    var ctx = this.canvas.getContext("2d");
    this.cellWidth = cellWidth;
    this.cellHeight = cellHeight;
    this.translation = {x: 0, y: 0};
    this.scaleLevel = 1.0;
    this.gridColor = "#aaaaaa";
    this.fillStyle = "#eeeeee";

    this.data = [];
    this.panel = $("<div></div>");
    this.panel.append(this.canvas);
    target.append(this.panel[0]);
    this.render();
  }

  getCell(x, y) {
    if(this.data[x]){
      if(!this.data[x][y]){
        this.data[x][y] = new Cell(this, x, y, this.cellWidth, this.cellHeight);
      }
    }else{
      this.data[x] = [];
      this.data[x][y] = new Cell(this, x, y, this.cellWidth, this.cellHeight);
    }
    return this.data[x][y];
  }

  isCell(x, y) {
    return (this.data[x] && this.data[x][y]);
  }

  removeCell(x, y) {
      var ctx = this.canvas.getContext("2d");
      ctx.clearRect(x * this.cellWidth, y * this.cellHeight, this.cellWidth + 1, this.cellHeight + 1)
    this.data[x][y] = undefined;
    delete this.data[x][y];
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
    if(Math.abs(this.width() * this.cellWidth - this.canvas.width) > this.cellWidth || Math.abs(this.height() * this.cellHeight -this.canvas.height) > this.cellHeight){
      this.canvas.width = this.width() * this.cellWidth; 
      this.canvas.height = this.height() * this.cellHeight; 
      ctx.canvas.width = this.width() * this.cellWidth; 
      ctx.canvas.height = this.height() * this.cellHeight; 
      this.canvas.getContext("2d").translate(this.translation.x,this.translation.y);
      console.debug(this.width(),this.canvas.width, "resized");
    }

    ctx.globalCompositeOperation = "copy";
    ctx.fillRect(0,0,0,0);
    ctx.stroke();

    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = this.gridColor;
    ctx.fillRect(-this.translation.x, -this.translation.y, this.width() * this.cellWidth, this.height() * this.cellHeight);
    ctx.stroke();
    ctx.moveTo(0,0);
    var d = {x: this.translation.x/this.cellWidth, y: this.translation.y/this.cellHeight}
    ctx.globalCompositeOperation = "source-over";
    var height = this.height();
    var width = this.width();
    for(var i = 0; i < height; ++i){
      for(var j = 0; j < width; ++j){
        var x = j - d.x;
        var y =  i - d.y;
        if(this.isCell(x,y)){
          this.data[x][y].render(ctx, false);
        }else{
          ctx.fillStyle = this.fillStyle;
          ctx.fillRect(x * this.cellWidth + 1, y * this.cellHeight + 1, this.cellWidth - 1, this.cellHeight - 1);
        }
      }
    }
    ctx.stroke();
    if(this.onRenderFunction){
      this.onRenderFunction();
    }
    console.debug("map rendered");
  }

  

  toJson(){
    var data = {fs: this.fillStyle, data: []}
    for(var x in this.data){
      for(var y in this.data[x]){
        if(this.data[k] && typeof(this.data[k]) != "function"){
          var c = this.data[k];
          data.data.push({x: c.x, y: c.y, fs: c.fillStyle});
        }
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
    this.canvas.getContext("2d").translate(x, y);
    this.render();
  }

}
