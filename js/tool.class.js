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
    var x = evt.offsetX / this.map.cellWidth;
    var y = evt.offsetY / this.map.cellHeight;
    this.map.data[Math.floor(x)][Math.floor(y)].fillStyle = "black";
    this.map.data[Math.floor(x)][Math.floor(y)].render(this.map.canvas.getContext("2d"));
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
      this.activeTool = this.rectSelector;
    });
    this.magicStick.button.on("click", function(){
      div.find(".btn").removeClass("btn-primary");
      t.magicStick.button.addClass("btn-primary");
      this.activeTool = this.magicStick;
    });
    this.pencil.button.on("click", function(){
      div.find(".btn").removeClass("btn-primary");
      t.pencil.button.addClass("btn-primary");
      this.activeTool = this.pencil;
    });
    this.picker.button.on("click", function(){
      div.find(".btn").removeClass("btn-primary");
      t.picker.button.addClass("btn-primary");
      this.activeTool = this.picker;
    });
    this.bucket.button.on("click", function(){
      div.find(".btn").removeClass("btn-primary");
      t.bucket.button.addClass("btn-primary");
      this.activeTool = this.bucket;;
    });

    this.panel.append(grp);
    this.activeTool = this.pencil;
    div.append(this.panel);

    target.append(div[0]);
  }
  onMouseMove(self, evt){
    self.activeTool.onMouseMove(evt);
  }
  onMouseUp(self, evt){
    self.activeTool.onMouseUp(evt);
  }
  onMouseDown(self, evt){
    self.activeTool.onMouseDown(evt);
  }
  onClick(self, evt){
    self.activeTool.onClick(evt);
  }
}
