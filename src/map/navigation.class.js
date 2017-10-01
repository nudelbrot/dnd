import {Minimap} from "./Minimap.class";
export class Navigation{
  constructor(target, map){
    this.map = map;
    this.minimap = new Minimap(target, map, this);
    this.jumppoints = [];
    for(var i = 0; i < 10; ++i){
      this.jumppoints.push({x: 0, y:0});
    }
    this.prepareListener();

  }

  prepareListener(){
    this.map.on("touchmove", (evt) => {evt.which=1; this.onMouseMove(evt)});
    this.map.on("touchstart", (evt) => {evt.which=1; this.onMouseDown(evt)});
    this.map.on("touchend", (evt) => {evt.which=1; this.onMouseUp(evt);});
    this.map.on("mousemove", (evt) => this.onMouseMove(evt));
    this.map.on("mousedown", (evt) => this.onMouseDown(evt));
    this.map.on("mouseup", (evt) => this.onMouseUp(evt));
    if (this.map.canvas.addEventListener) {
      // IE9, Chrome, Safari, Opera
      this.map.canvas.addEventListener("mousewheel", (evt) => this.onMouseWheel(evt), false);
      // Firefox
      this.map.canvas.addEventListener("DOMMouseScroll", (evt) => this.onMouseWheel(evt), false);
    }
    // IE 6/7/8
    else this.map.canvas.attachEvent("onmousewheel", (evt) => this.onMouseWheel(evt));

    $("body").on("keydown", (evt) => this.onKeyDown(evt));
  }

  onMouseWheel(event){
    var evt = window.event || event;
    var delta = Math.max(-1, Math.min(1, (evt.wheelDelta || -evt.detail)));
    if(delta < 0){
      if(evt.shiftKey){
        this.translate(1, 0);
      }else{
        this.translate(0, -1);
      }
    }else{
      if(evt.shiftKey){
        this.translate(-1, 0);
      }else{
        this.translate(0, 1);
      }
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

  onResize(evt){
    //this.minimap.viewport.css({
    //  "width": this.map.canvas.width / (this.minimap.scale*4),
    //  "height": this.map.canvas.height / (this.minimap.scale*4),
    //  "left": this.minimap.canvas.width/2 - this.minimap.viewport.width()/2,
    //  "top": this.minimap.canvas.height/2 - this.minimap.viewport.height()/2
    //});
    //this.minimap.canvas.width = this.minimap.map.canvas.width / this.minimap.scale*4;
    //this.minimap.canvas.height = this.minimap.map.canvas.height / this.minimap.scale*4;
    //this.minimap.render();
  }

  onKeyDown(evt){
    if(evt.which == 87 || evt.which == 38){
      this.translate(0, 1);
    }else if(evt.which == 65 || evt.which == 37){
      this.translate(1, 0);
    }else if(evt.which == 83 || evt.which == 40){
      this.translate(0, -1);
    }else if(evt.which == 68 || evt.which == 39){
      this.translate(-1, 0);
    }else if(evt.which == 187){
      this.map.scale("in");
    }else if(evt.which == 189){
      this.map.scale("out");
    }else if(evt.which == 48){
      this.map.scale("reset");
    }else if(evt.which == 27 || evt.which == 32){
      this.jump(-1);
      //this.map.changeCellSize(32); // TODO
    }else if(evt.which == 192 || evt.which == 8){
      this.jump(9);
    }else if(evt.which >= 49 && evt.which <= 57){
      var jp = this.jumppoints[evt.which-49];
      if(evt.shiftKey){
        jp.x = this.map.translation.x;
        jp.y = this.map.translation.y;
      }else{
        this.jump(evt.which-49);
      }
    }else if(evt.which == 82){
      this.onResize();
    }else{
      //console.debug(evt.which);
    }
  }

  translate(x, y){
    this.minimap.translate(x, y);
    this.map.translate(x, y);
  }

  jump(i){
    if(i == 9){
      var translation = {x: this.map.translation.x, y: this.map.translation.y};
      //TODO this.minimap.canvas.getContext("2d").translate((-this.map.translation.x + this.jumppoints[i].x), (-this.map.translation.y + this.jumppoints[i].y));
      this.map.translate(-this.map.translation.x + this.jumppoints[i].x, -this.map.translation.y + this.jumppoints[i].y);
      this.jumppoints[9].x = translation.x;
      this.jumppoints[9].y = translation.y;
    }else{
      this.jumppoints[9].x = this.map.translation.x;
      this.jumppoints[9].y = this.map.translation.y;
      if(i == -1){
        //TODO this.minimap.canvas.getContext("2d").translate(-this.map.translation.x, -this.map.translation.y);
        this.map.translate(-this.map.translation.x, -this.map.translation.y);
      }else{
        //TODO this.minimap.canvas.getContext("2d").translate((-this.map.translation.x + this.jumppoints[i].x), (-this.map.translation.y + this.jumppoints[i].y));
        this.map.translate(-this.map.translation.x + this.jumppoints[i].x, -this.map.translation.y + this.jumppoints[i].y);
      }
    }
  }
}
