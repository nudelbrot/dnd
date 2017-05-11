class Navigation{
  constructor(target, map){
    this.target = target;
    this.map = map;
    
    var t = this;
    this.map.on("mousemove", function(evt){t.onMouseMove(evt);});
    this.map.on("mousedown", function(evt){t.onMouseDown(evt);});
    this.map.on("mouseup", function(evt){t.onMouseUp(evt);});
    $("body").on("keydown", function(evt){
      t.onKeyDown(evt);
    });
    this.latest = {x: 0, y: 0, w: 0, h: 0};
  }
  onMouseUp(evt){
    if(evt.which == 2){
      this.map.translate((this.latest.x - evt.offsetX));
    }
  }
  onMouseDown(evt){
    if(evt.which == 2){
      this.latest.x = evt.offsetX;
      this.latest.y = evt.offsetY;
      console.debug(this.latest);
    }
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
    } 
    console.debug(evt.which);
  }
}
