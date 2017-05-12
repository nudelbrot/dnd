class Tool {
  constructor(map){
    this.map = map;
    this.icon = "";
    this.button = undefined;
    this.panel = $("<div class='panel panel-default toolSettings'></div>");
    this.panel.append($("<div class='panel-body'></div>"));
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
    return {x: (evt.offsetX - this.map.translation.x) / this.map.cellWidth, y: (evt.offsetY - this.map.translation.y)/ this.map.cellHeight};
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
    var t = this;
    this.button.on("click", function(){
      t.map.translate(-24,0);
    });
  }
}

class MagicStickTool extends SelectionTool {
  constructor(map) {
    super(map);
    this.icon = "open_with";
    this.button = $('<button type="button" class="btn btn-default"> <span class="material-icons">'+this.icon+'</span></button>');
    var t = this;
    this.button.on("click", function(){
      t.map.translate(24,0);
    });

  }
  onMouseMove(evt){
    
  }

  onMouseDown(evt){
    this.mouseDown = true;
  }

  onMouseUp(evt){
    this.mouseDown = false;
  }
}

class SculptureTool extends Tool {
  constructor(map) {
    super(map);
    this.foregroundColor = "#000000";
    this.backgroundColor = "#ffffff";
    this.latestColors = [];
  }
  addSize(){
    var body = this.panel.find(".panel-body");
  }

}

class PickerTool extends SculptureTool {
  constructor(map) {
    super(map);
    this.icon = "colorize"
    this.button = $('<button type="button" class="btn btn-default"> <span class="material-icons">'+this.icon+'</span></button>');
  }
  onClick(evt){
    var pos = this.evtToCoordinates(evt);
    //this.colorpicker.colorpicker("setValue", this.map.data[Math.floor(pos.x)][Math.floor(pos.y)].fillStyle);
  }
}

class PencilTool extends SculptureTool {
  constructor(map) {
    super(map);
    this.size = 1;
    this.icon = "edit"
    this.button = $('<button type="button" class="btn btn-default"> <span class="material-icons">'+this.icon+'</span></button>');
    this.mouseDown = false;
    this.latest = {x: 0, y: 0};
  }
  onClick(evt){
    var pos = this.evtToCoordinates(evt);
    pos.x = Math.floor(pos.x);
    pos.y = Math.floor(pos.y);
    if(evt.type == "click"){
        this.map.getCell(pos.x, pos.y).fillStyle = this.foregroundColor;
    }else{
        this.map.getCell(pos.x, pos.y).fillStyle = this.backgroundColor;
    }
        this.map.getCell(pos.x, pos.y).render(this.map.canvas.getContext("2d"));
    //this.map.render();

  }
  onMouseMove(evt){
    if(evt.which == 1 || evt.which == 3){
      var pos = this.evtToCoordinates(evt);
      pos.x = Math.floor(pos.x);
      pos.y = Math.floor(pos.y);
      if(this.latest.x != pos.x || this.latest.y != pos.y){
        this.latest.x = pos.x;
        this.latest.y = pos.y;
        if(evt.which == 1){
          this.map.getCell(pos.x, pos.y).fillStyle = this.foregroundColor;
        }else{
          this.map.getCell(pos.x, pos.y).fillStyle = this.backgroundColor;
        }
        this.map.getCell(pos.x, pos.y).render(this.map.canvas.getContext("2d"));
      }
    }
  }
}

class BucketTool extends SculptureTool {
  constructor(map) {
    super(map);
    this.icon = "format_color_fill";
    this.button = $('<button type="button" class="btn btn-default"> <span class="material-icons">' + this.icon + '</span></button>');
    this.Stack = [];
    this.cellsToFill = [];
    this.old;
    this.inListOfCurrentCells = false;
    this.listOfCurrentCells;
  }
  onClick(evt){
    var pos = this.evtToCoordinates(evt);
    pos = [Math.floor(pos.x), Math.floor(pos.y)];
    var coordString = pos[0] + "/" + pos[1]
    this.listOfCurrentCells = Object.keys(this.map.data)
    this.inListOfCurrentCells = $.inArray(coordString, this.listOfCurrentCells)
    console.debug("inListOfCurrentCells: " + this.inListOfCurrentCells)

    this.old = this.map.getCell(pos[0], pos[1]).fillStyle;
    if (this.old == this.foregroundColor) {
        return;
    }
    console.debug(this.old)
    this.cellsToFill = [];
    this.Stack = [];
    console.debug("Start flooding")
    this.floodFill(pos[0], pos[1]);
    console.debug("Ended flooding: ", this.cellsToFill);
    var t = this;
    this.cellsToFill.forEach(function (coord) {
        var cell = t.map.getCell(coord[0], coord[1])
        cell.fillStyle = t.foregroundColor;
    })
    var ctx = this.map.canvas.getContext("2d")
    t.map.render();
  }

  floodFill(x, y) {
      console.debug("flood: " + x + ", " + y)
      this.fillPixel(x, y);
      var counter = 0;
      while (this.Stack.length > 0 && counter < 100) {
          this.toFill = this.Stack.pop();
          this.fillPixel(this.toFill[0], this.toFill[1]);
          counter++;
      }
  }

  fillPixel(x, y) {
      if (!this.alreadyFilled(x, y)) this.fill(x, y);

      if (!this.alreadyFilled(x, y - 1)) this.Stack.push([x, y - 1]);
      if (!this.alreadyFilled(x + 1, y)) this.Stack.push([x + 1, y]);
      if (!this.alreadyFilled(x, y + 1)) this.Stack.push([x, y + 1]);
      if (!this.alreadyFilled(x - 1, y)) this.Stack.push([x - 1, y]);
  }

  fill(x, y) {
      this.cellsToFill.push([x, y]);
  }

  alreadyFilled(x, y) {
      var coordString = x + "/" + y;
      var cellsToFillStringArray = this.cellsToFill.map(function (obj) { return obj[0] + "/" + obj[1] });
      if ($.inArray(coordString, this.listOfCurrentCells) != -1) { //wenn (x,y) schon eine Zelle ist
          console.debug(coordString + " is in " + this.listOfCurrentCells + "\nRETURN " + ((this.map.getCell(x, y).fillStyle != this.old) || $.inArray(coordString, cellsToFillStringArray) != -1))
          return ((this.map.getCell(x, y).fillStyle != this.old) || $.inArray(coordString, cellsToFillStringArray) != -1);
      } else {
          console.debug(coordString + " is not in " + this.listOfCurrentCells + "\nRETURN " + ($.inArray(coordString, cellsToFillStringArray) != -1 && this.inListOfCurrentCells == -1))
          return ($.inArray(coordString, cellsToFillStringArray) != -1 || this.inListOfCurrentCells != -1);
      }
  }
}

class HeightTool extends SculptureTool {
  constructor(map) {
    super(map);
  }
}

class Toolbar {
  constructor(target, map) {
    this.map = map;
    this.panel = $("<div id='tb_panel' class='panel panel-default'></div>");
    this.panel.css("float", "left");
    this.panel.css("width", 300);
    this.panel.css("height", 512);
    this.panel.append($("<div id='tb_body' class='panel-body'></div>"));
    this.foregroundColor = "#000000";
    this.backgroundColor = "#ffffff";
    this.addColorpickers();
    this.addTools();
    target.append(this.panel[0]);
    var t = this;
    $(this.map.canvas).bind('contextmenu', function(e) {
        t.onClick(e);
          return false;
    }); 

    this.map.on("click", function(evt){t.onClick(evt);});
    this.map.on("mouseup", function(evt){t.onMouseUp(evt);});
    this.map.on("mousedown", function(evt){t.onMouseDown(evt);});
    this.map.on("mousemove", function(evt){t.onMouseMove(evt);});
  }

  addTools(){
    this.rectSelector = new RectSelectionTool(this.map);
    this.magicStick = new MagicStickTool(this.map);
    this.pencil = new PencilTool(this.map);
    this.picker = new PickerTool(this.map);
    this.bucket = new BucketTool(this.map);
    var grp = $('<div class="btn-group" role="group"></div>');

    grp.append(this.rectSelector.button);
    grp.append(this.magicStick.button);
    grp.append(this.picker.button);
    grp.append(this.pencil.button);
    grp.append(this.bucket.button);
    var t = this;

    this.rectSelector.button.on("click", function(){
      t.setActiveTool(t.rectSelector);
    });
    this.magicStick.button.on("click", function(){
      t.setActiveTool(t.magicStick);
    });
    this.pencil.button.on("click", function(){
      t.setActiveTool(t.pencil);
    });
    this.picker.button.on("click", function(){
      t.setActiveTool(t.picker);
    });
    this.bucket.button.on("click", function(){
      t.setActiveTool(t.bucket);
    });

    this.activeTool = this.pencil;
    //this.setActiveTool(this.pencil);
    var body = this.panel.find("#tb_body");
    body.append(grp);
    
  }

  addColorpickers(){
    var body = this.panel.find(".panel-body");
    this.foregroundColorPicker = $('<div id="fgCp" data-format="alias" class="input-group colorpicker-component">'
      +'<input type="text" value="primary" class="form-control" />'
      +'<span class="input-group-addon"><i></i></span>'
      +'</div>');
    this.backgroundColorPicker = $('<div id="bgCp" data-format="alias" class="input-group colorpicker-component">'
      +'<input type="text" value="primary" class="form-control" />'
      +'<span class="input-group-addon"><i></i></span>'
      +'</div>');
    var t = this;
    this.foregroundColorPicker.colorpicker().on("changeColor", function(e){
      if(e.value){
        t.foregroundColor = e.value;
        t.pencil.foregroundColor = e.value;
        t.bucket.foregroundColor = e.value;
      }
    });
    this.backgroundColorPicker.colorpicker().on("changeColor", function(e){
      if(e.value){
        t.backgroundColor = e.value;
        t.pencil.backgroundColor = e.value;
        t.bucket.backgroundColor = e.value;
      }
    });
    body.append(this.foregroundColorPicker);
    body.append(this.backgroundColorPicker);
  }

  setActiveTool(tool){
    this.activeTool.panel.detach();
    this.activeTool = tool;
    this.panel.find(".btn").removeClass("btn-primary");
    tool.button.addClass("btn-primary");
    this.panel.find(".panel-body").append(this.activeTool.panel);
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
