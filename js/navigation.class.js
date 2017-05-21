class MiniMap{
    constructor(target, map, navigation, width=128, height=128){
        this.target = target;
        this.map = map;
        this.navigation = navigation;
        this.div = $("<div></div>");
        this.canvas = $("<canvas id='minimap'></canvas>")[0];
        this.canvas.width = width;
        this.canvas.height = height;
        $(this.canvas).css("background", "#ddd");
        this.div.css("position", "relative");
        this.div.append(this.canvas);
        this.target.append(this.div);
        this.scale = 5

        //this.canvas.style.width='100%';
        //this.canvas.style.height='100%';
        //this.canvas.width  = this.canvas.offsetWidth;
        //this.canvas.height = this.canvas.offsetHeight;
        var ctx = this.canvas.getContext("2d");
        ctx.canvas.width = this.map.canvas.width / this.scale;
        ctx.canvas.height = this.map.canvas.height / this.scale;

        this.viewport = $("<div></div>");
        this.viewport.css("width", this.map.canvas.width / (this.scale*4));
        this.viewport.css("height", this.map.canvas.height / (this.scale*4));
        this.viewport.css("background", "rgba(20,20,20, 0.2)");
        this.viewport.css("float", "right");
        this.viewport.css("position", "absolute");
        this.viewport.css("left", this.canvas.width/2 - this.viewport.width()/2);
        this.viewport.css("top", this.canvas.height/2 - this.viewport.height()/2);
        //this.viewport.offset({
        //  left: $(this.canvas).offset().left + Math.floor(this.canvas.width/2) + Math.floor(this.viewport.width()/2 - 2),
        //  top:  $(this.canvas).offset().top + Math.floor(this.canvas.height/2) + Math.floor(this.viewport.height()/2 - 2)
        //});
        this.div.append(this.viewport[0]);
        var t = this;
        this.drag = false;
        $(this.canvas).on("mousedown", function(evt){t.drag = true;});
        $(this.canvas).on("mouseup", function(evt){t.drag = false;});
        this.viewport.on("click", 
          function(evt){ 
              t.navigation.translate(t.viewport.width()/2 - evt.offsetX, t.viewport.height()/2 - evt.offsetY);
          });
        $(this.canvas).on("click", 
          function(evt){ 
              t.navigation.translate(t.canvas.width/2 - evt.offsetX, t.canvas.height/2 - evt.offsetY);
          });
        this.map.on("render", function(){t.render();});

    }


        render(){
            var ctx = this.canvas.getContext("2d");
            ctx.globalCompositeOperation = "copy";
            ctx.rect(0,0,0,0);
            ctx.stroke();
            ctx.globalCompositeOperation = "source-over";
            var t = this;
            var p = {x: t.canvas.width/2 - t.viewport.width()/2, y: t.canvas.height/2  - t.viewport.height()/2};
            var currentCells = this.map.getCurrentCells();
            currentCells.forEach(function(cell){
                ctx.fillStyle = cell.fillStyle;
                ctx.fillRect(p.x + cell.x, p.y + cell.y, 1, 1);
            });
            ctx.stroke();
        }
    }

    class Navigation{
      constructor(target, map){
        this.target = target;
        this.map = map;
    
        this.panel = $("<div></div>");
        this.panel.css({"position": "absolute", "float":"right", "right": "10px", "bottom": "5px"});
        this.minimap = new MiniMap(this.panel, map, this);
        this.target.append(this.panel[0]);
        this.jumppoints = [];
        for(var i = 0; i < 10; ++i){
            this.jumppoints.push({x: 0, y:0});
        }

        var t = this;
        this.map.on("mousemove", function(evt){t.onMouseMove(evt);});
        this.map.on("mousedown", function(evt){t.onMouseDown(evt);});
        this.map.on("mouseup", function(evt){t.onMouseUp(evt);});
        this.map.on("mousewheel", function(evt){t.onMouseWheel(evt);});
        $("body").on("keydown", function(evt){
            t.onKeyDown(evt);
        });
    }

    onMouseWheel(evt){
        if(evt.originalEvent.deltaY > 0){
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
        }else{
            console.debug(evt.which);
        }
    }

    translate(x, y){
        this.minimap.canvas.getContext("2d").translate(x, y);
        this.map.translate(x * this.map.cellWidth, y * this.map.cellHeight);
    }

    jump(i){
        if(i == 9){
            var trans = {x: this.map.translation.x, y: this.map.translation.y};
            this.minimap.canvas.getContext("2d").translate((-this.map.translation.x + this.jumppoints[i].x)/this.map.cellWidth, (-this.map.translation.y + this.jumppoints[i].y)/this.map.cellHeight);
            this.map.translate(-this.map.translation.x + this.jumppoints[i].x, -this.map.translation.y + this.jumppoints[i].y);
            this.jumppoints[9].x = trans.x;
            this.jumppoints[9].y = trans.y;
        }else{
            this.jumppoints[9].x = this.map.translation.x;
            this.jumppoints[9].y = this.map.translation.y;
            if(i == -1){
                this.minimap.canvas.getContext("2d").translate(-this.map.translation.x/this.map.cellWidth, -this.map.translation.y/this.map.cellHeight);
                this.map.translate(-this.map.translation.x, -this.map.translation.y);
            }else{
                this.minimap.canvas.getContext("2d").translate((-this.map.translation.x + this.jumppoints[i].x)/this.map.cellWidth, (-this.map.translation.y + this.jumppoints[i].y)/this.map.cellHeight);
                this.map.translate(-this.map.translation.x + this.jumppoints[i].x, -this.map.translation.y + this.jumppoints[i].y);
            }
        }
    }
}
