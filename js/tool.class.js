class Tool {
  constructor(map){
    this.map = map;
    this.icon = "";
    this.button = undefined;
  }
  onMouseMove(self, evt){
  }
  onMouseUp(self, evt){
  }
  onMouseDown(self, evt){
  }
  onClick(self, evt){
  }

  evtToCoordinates(evt){
    return {x: evt.offsetX / this.map.cellWidth, y:evt.offsetY / this.map.cellHeight};
  }

}

class SelectionTool extends Tool {
  constructor(map){
    super(map);
  }
  
}

class RectSelectionTool extends SelectionTool {
  constructor(map) {
    super(map);
    this.icon = "crop_free";
    this.button = $('<button type="button" class="btn btn-default"> <span class="material-icons">'+this.icon+'</span></button>');
  }
}

class MagicStickTool extends SelectionTool {
  constructor(map) {
    super(map);
    this.icon = "open_with";
    this.button = $('<button type="button" class="btn btn-default"> <span class="material-icons">'+this.icon+'</span></button>');
  }
}

class SculptureTool extends Tool {
  constructor(map) {
    super(map);
    this.color = "black";
  }
}

class PencilTool extends SculptureTool {
  constructor(map) {
    super(map);
    this.size = 1;
    this.icon = "edit"
    this.button = $('<button type="button" class="btn btn-default"> <span class="material-icons">'+this.icon+'</span></button>');
  }
  onClick(evt){
    var pos = this.evtToCoordinates(evt);
    this.map.data[Math.floor(pos.x)][Math.floor(pos.y)].fillStyle = "black";
    this.map.data[Math.floor(pos.x)][Math.floor(pos.y)].render(this.map.canvas.getContext("2d"));
    //this.map.render();
  }
}

class PickerTool extends SculptureTool {
  constructor(map) {
    super(map);
    this.icon = "colorize"
    this.button = $('<button type="button" class="btn btn-default"> <span class="material-icons">'+this.icon+'</span></button>');
  }
}

class BucketTool extends SculptureTool {
  constructor(map) {
    super(map);
    this.icon = "format_color_fill";
    this.button = $('<button type="button" class="btn btn-default"> <span class="material-icons">'+this.icon+'</span></button>');
  }
  onClick(evt){
    var pos = this.evtToCoordinates(evt);
    var old = this.map.data[Math.floor(pos.x)][Math.floor(pos.y)].fillStyle;
    var neighbors = [];
    var lst = [];
    neighbors.push({x: Math.floor(pos.x), y: Math.floor(pos.y)});
    var ctx = this.map.canvas.getContext("2d")
    while(neighbors.length > 0){
      var n = neighbors.pop();
      lst.push(n);
      if(n.x - 1 >= 0 && this.map.data[n.x - 1][n.y].fillStyle == old){
        var found = false;
        lst.forEach(function(v){
          found = found || ((v.x == n.x - 1) && (v.y == n.y));
        });
        if(!found){
          neighbors.push({x: n.x - 1, y: n.y});
        }
      }
      if(n.y - 1 >= 0 && this.map.data[n.x][n.y - 1].fillStyle == old){
        var found = false;
        lst.forEach(function(v){
          found = found || ((v.x == n.x) && (v.y == n.y - 1));
        });
        if(!found){
          neighbors.push({x: n.x, y: n.y - 1});
        }
      }
      if(n.x + 1 < this.map.width && this.map.data[n.x + 1][n.y].fillStyle == old){
        var found = false;
        lst.forEach(function(v){
          found = found || ((v.x == n.x + 1) && (v.y == n.y));
        });
        if(!found){
          neighbors.push({x: n.x + 1, y: n.y});
        }
      }
      if(n.y + 1 < this.map.height && this.map.data[n.x][n.y + 1].fillStyle == old){
        var found = false;
        lst.forEach(function(v){
          found = found || ((v.x == n.x) && (v.y == n.y + 1));
        });
        if(!found){
          neighbors.push({x: n.x, y: n.y + 1});
        }
      }
    }
    var t = this;
    lst.forEach(function(v){
      t.map.data[v.x][v.y].fillStyle = t.color;
      t.map.data[v.x][v.y].render(ctx);
    });
  }
}

class HeightTool extends SculptureTool {
  constructor(map) {
    super(map);
  }
}

class Toolbar {
  constructor(target, map) {
    var div = $("<div id='tb_panel'></div>");
    div.addClass("panel panel-default");
    div.css("float", "left");
    div.css("width", 300);
    div.css("height", 512);
    this.panel = $("<div></div>");
    this.panel.addClass("panel-body");
    this.rectSelector = new RectSelectionTool(map);
    this.magicStick = new MagicStickTool(map);
    this.pencil = new PencilTool(map);
    this.picker = new PickerTool(map);
    this.bucket = new BucketTool(map);
    var grp = $('<div class="btn-group" role="group"></div>');

    grp.append(this.rectSelector.button);
    grp.append(this.magicStick.button);
    grp.append(this.picker.button);
    grp.append(this.pencil.button);
    grp.append(this.bucket.button);
    var t = this;

    this.rectSelector.button.on("click", function(){
      div.find(".btn").removeClass("btn-primary");
      t.rectSelector.button.addClass("btn-primary");
      t.activeTool = t.rectSelector;
    });
    this.magicStick.button.on("click", function(){
      div.find(".btn").removeClass("btn-primary");
      t.magicStick.button.addClass("btn-primary");
      t.activeTool = t.magicStick;
    });
    this.pencil.button.on("click", function(){
      div.find(".btn").removeClass("btn-primary");
      t.pencil.button.addClass("btn-primary");
      t.activeTool = t.pencil;
    });
    this.picker.button.on("click", function(){
      div.find(".btn").removeClass("btn-primary");
      t.picker.button.addClass("btn-primary");
      t.activeTool = t.picker;
    });
    this.bucket.button.on("click", function(){
      div.find(".btn").removeClass("btn-primary");
      t.bucket.button.addClass("btn-primary");
      t.activeTool = t.bucket;
    });

    this.panel.append(grp);
    this.activeTool = this.pencil;
    this.activeTool.button.addClass("btn-primary");
    div.append(this.panel);

    target.append(div[0]);
  }
  onMouseMove(evt){
    this.activeTool.onMouseMove(evt);
  }
  onMouseUp(evt){
    this.activeTool.onMouseUp(evt);
  }
  onMouseDown(evt){
    this.activeTool.onMouseDown(evt);
  }
  onClick(evt){
    this.activeTool.onClick(evt);
  }
}
