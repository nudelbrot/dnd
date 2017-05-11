class MiniMap{
  constructor(target, map){
    this.map = map;
  }
}

class Navigation{
  constructor(target, map){
    this.target = target;
    this.map = map;
    
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
    }else if(evt.which == 27){
      this.map.translate(-this.map.translation.x, -this.map.translation.y);
    }else{
      console.debug(evt.which);
    }

  }
}
