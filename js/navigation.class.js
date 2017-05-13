class MiniMap{
  constructor(target, map, width=128, height=128){
    this.target = target;
    this.map = map;
    this.div = $("<div class='well'></div>");
    this.canvas = $("<canvas id='minimap'></canvas>")[0];
    this.canvas.width = width;
    this.canvas.height = height;
    this.div.append(this.canvas);
    this.target.append(this.div);

    this.canvas.style.width='100%';
    this.canvas.style.height='100%';
    this.canvas.width  = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
    var ctx = this.canvas.getContext("2d");
    ctx.canvas.width = this.map.width*this.map.cellWidth/2;
    ctx.canvas.height = this.map.height*this.map.cellWidth/2;

    this.viewport = $("<div></div>");
    this.viewport.css("width", this.map.canvas.width / this.map.cellWidth);
    this.viewport.css("height", this.map.canvas.height / this.map.cellHeight);
    this.viewport.css("background", "rgba(20,20,20, 0.2)");
    this.viewport.css("float", "right");
    this.viewport.css("position", "absolute");
    this.div.append(this.viewport[0]);
    var t = this;
    this.drag = false;
    this.viewport.on("mousedown", function(evt){t.drag = true;});
    this.viewport.on("mouseup", function(evt){t.drag = false;});
    this.viewport.on("mousemove", 
      function(evt){ 
        //if(t.drag){
        //  t.viewport.offset({ left: Math.min(Math.max(t.div.offset().left, evt.pageX-50), t.div.offset().left + t.div.width()-60), 
        //                      top: Math.min(Math.max(t.div.offset().top, evt.pageY-50), t.div.offset().top + t.div.height()-60) });
        //}
        //if(evt.pageY <= t.div.offset().top || evt.pageY > t.div.offset().top + t.div.height() || evt.pageX < t.div.offset().left || evt.pageX > t.div.offset().left + t.div.width()){
        //  t.drag = false;
        //}
      });
    this.map.on("render", function(){t.render();});

  }


  render(){
    this.viewport.offset({
      left: $(this.canvas).offset().left -((this.map.translation.x/this.map.cellWidth)),
      top:  $(this.canvas).offset().top -this.map.translation.y/this.map.cellHeight
    });
    var ctx = this.canvas.getContext("2d");
    var t = this;
    Object.keys(this.map.data).forEach(function(key){
      var cell = t.map.data[key];
      ctx.fillStyle = cell.fillStyle;
      ctx.fillRect(cell.x+1, cell.y+1, 1, 1);
    });
    ctx.stroke();
  }
}

class Navigation{
  constructor(target, map){
    this.target = target;
    this.map = map;
    
    this.panel = $("<div class='panel panel-default col-md-3'></div>");
    var body = $("<div class='panel-body'></div>");

    this.panel.append(body);
    this.minimap = new MiniMap(body, map);
    this.target.append(this.panel[0]);

    var t = this;
    this.map.on("mousemove", function(evt){t.onMouseMove(evt);});
    this.map.on("mousedown", function(evt){t.onMouseDown(evt);});
    this.map.on("mouseup", function(evt){t.onMouseUp(evt);});
    //this.map.on("mousewheel", function(evt){t.onMouseWheel(evt);});
    $("body").on("keydown", function(evt){
      t.onKeyDown(evt);
    });
  }

  onMouseWheel(evt){
    if(evt.originalEvent.deltaY > 0){
      this.map.scale("out");
    }else{
      this.map.scale("in");
    }
  }

  onMouseUp(evt){
    if(evt.which == 2){
      this.map.scale("reset");
    }
  }

  onMouseDown(evt){
  }

  onMouseMove(evt){
  }

  onKeyDown(evt){
    if(evt.which == 87 || evt.which == 38){
      this.map.translate(0, this.map.cellHeight);
    }else if(evt.which == 65 || evt.which == 37){
      this.map.translate(this.map.cellWidth, 0);
    }else if(evt.which == 83 || evt.which == 40){
      this.map.translate(0, -this.map.cellHeight);
    }else if(evt.which == 68 || evt.which == 39){
      this.map.translate(-this.map.cellWidth, 0);
    }else if(evt.which == 187){
      this.map.scale("in");
    }else if(evt.which == 189){
      this.map.scale("out");
    }else if(evt.which == 48){
      this.map.scale("reset");
    }else if(evt.which == 27 || evt.which == 32){
      this.map.translate(-this.map.translation.x, -this.map.translation.y);
    }else{
      console.debug(evt.which);
    }

  }
}
