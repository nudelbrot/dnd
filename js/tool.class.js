class Tool {
    constructor(map) {
        this.map = map;
        this.icon = "";
        this.button = undefined;
        this.panel = $("<div class='panel panel-default toolSettings'></div>");
        this.panel.append($("<div class='panel-body'></div>"));
    }
    onMouseMove(self, evt) {
    }
    onMouseUp(self, evt) {
    }
    onMouseDown(self, evt) {
    }
    onClick(self, evt) {
    }

    evtToCoordinates(evt) {
        return { x: (evt.offsetX - this.map.translation.x) / this.map.cellWidth, y: (evt.offsetY - this.map.translation.y) / this.map.cellHeight };
    }

}

class SelectionTool extends Tool {
    constructor(map) {
        super(map);
    }

}

class RectSelectionTool extends SelectionTool {
    constructor(map) {
        super(map);
        this.icon = "crop_free";
        this.button = $('<button type="button" class="btn btn-default"> <span class="material-icons">' + this.icon + '</span></button>');
    }
}

class MagicStickTool extends SelectionTool {
    constructor(map) {
        super(map);
        this.icon = "open_with";
        this.button = $('<button type="button" class="btn btn-default"> <span class="material-icons">' + this.icon + '</span></button>');
        this.Stack = [];
        this.cellsToFill = [];
        this.old;
        this.inListOfCurrentCells = false;
        this.listOfCurrentCells;
        this.xmin
        this.xmax
        this.ymin
        this.ymax
    }
    onClick(evt) {
        var pos = this.evtToCoordinates(evt);
        pos = [Math.floor(pos.x), Math.floor(pos.y)];
        var coordString = pos[0] + "/" + pos[1]
        this.listOfCurrentCells = Object.keys(this.map.data)
        this.inListOfCurrentCells = $.inArray(coordString, this.listOfCurrentCells)
        var xAndYofCurrentCells = this.listOfCurrentCells.map(function (obj) {
            var coord = obj.split("/")
            return [coord[0], coord[1]]
        });
        var xOfCurrentCells = xAndYofCurrentCells.map(function (obj) {
            return obj[0]
        })
        var yOfCurrentCells = xAndYofCurrentCells.map(function (obj) {
            return obj[1]
        })
        this.xmin = Math.min.apply(null, xOfCurrentCells)
        this.xmax = Math.max.apply(null, xOfCurrentCells)
        this.ymin = Math.min.apply(null, yOfCurrentCells)
        this.ymax = Math.max.apply(null, yOfCurrentCells)
        //console.debug("inListOfCurrentCells: " + this.inListOfCurrentCells)
        if (this.outside(pos[0], pos[1])) {
            console.debug("not implemented yet.")
            return;
        }
        this.old = this.map.getCell(pos[0], pos[1]).fillStyle;
        this.cellsToFill = [];
        this.Stack = [];
        this.floodFill(pos[0], pos[1]);
        var t = this;
        this.cellsToFill.forEach(function (coord) {
            var cell = t.map.getCell(coord[0], coord[1])
            cell.highlight = !cell.highlight;
            cell.render()
        })
    }
    outside(x, y) {
        if (x < this.xmin || x > this.xmax || y < this.ymin || y > this.ymax) {
            return true;
        } else {
            return false;
        }
    }
    floodFill(x, y) {
        this.fillPixel(x, y);
        while (this.Stack.length > 0) {
            this.toFill = this.Stack.pop();
            this.fillPixel(this.toFill[0], this.toFill[1]);
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
        if (!this.outside(x, y)) {
            var coordString = x + "/" + y;
            var cellsToFillStringArray = this.cellsToFill.map(function (obj) { return obj[0] + "/" + obj[1] });
            if ($.inArray(coordString, this.listOfCurrentCells) != -1) {
                return ((this.map.getCell(x, y).fillStyle != this.old) || $.inArray(coordString, cellsToFillStringArray) != -1);
            } else {
                return ($.inArray(coordString, cellsToFillStringArray) != -1 || this.inListOfCurrentCells != -1);
            }
        } else {
            return true;
        }
    }
}

class SculptureTool extends Tool {
    constructor(map, foregroundColorPicker, backgroundColorPicker) {
        super(map);
        this.foregroundColor = "#000000";
        this.backgroundColor = "#ffffff";
        this.foregroundColorPicker = foregroundColorPicker;
        this.backgroundColorPicker = backgroundColorPicker;
        this.latestColors = [];
    }
    addSize() {
        var body = this.panel.find(".panel-body");
    }

    changeCellFillstyle(x, y, fillStyle){
      if (this.map.fillStyle == fillStyle){
          this.map.removeCell(x, y);
          this.map.render();
          return;
      } else {
          this.map.changeCellFillstyle(x, y, fillStyle)
          return;
      }
    }

    onClick(evt){
      if (evt.ctrlKey) {
        var pos = this.evtToCoordinates(evt);
        pos.x = Math.floor(pos.x);
        pos.y = Math.floor(pos.y);
        var picker = undefined;
        if (evt.type == "click"){
          picker = this.foregroundColorPicker;
        } else {
          picker = this.backgroundColorPicker;
        }
        if (this.map.isCell(pos.x, pos.y)){
            picker.colorpicker("setValue", this.map.getCell(pos.x, pos.y).fillStyle);
        } else {
            picker.colorpicker("setValue", this.map.fillStyle);
        }
          return;
      }
    }

}

class PencilTool extends SculptureTool {
    constructor(map, foregroundColorPicker, backgroundColorPicker) {
        super(map, foregroundColorPicker, backgroundColorPicker);
        this.size = 1;
        this.icon = "edit"
        this.button = $('<button type="button" class="btn btn-default"> <span class="material-icons">' + this.icon + '</span></button>');
        this.mouseDown = false;
        this.latest = { x: 0, y: 0 };
        this.shifted = { x: undefined, y: undefined, direction: undefined, reset: function () { this.x = undefined; this.y = undefined; this.direction = undefined; } };
    }
  onClick(evt) {
    super.onClick(evt);
    var pos = this.evtToCoordinates(evt);
    pos.x = Math.floor(pos.x);
    pos.y = Math.floor(pos.y);
    if (evt.type == "click") {
      this.changeCellFillstyle(pos.x, pos.y, this.foregroundColor);
    } else {
      this.changeCellFillstyle(pos.x, pos.y, this.backgroundColor);
    }
    this.map.getCell(pos.x, pos.y).render();
  }
    onMouseMove(evt) {
        if (!evt.shiftKey) {
            this.shifted.reset();
        }
        if (evt.which == 1 || evt.which == 3) {
            var fillStyle = evt.which == 1 ? this.foregroundColor : this.backgroundColor;
            var pos = this.evtToCoordinates(evt);
            pos.x = Math.floor(pos.x);
            pos.y = Math.floor(pos.y);

            if (evt.shiftKey) {
                if (this.shifted.direction == "vertical") {
                  this.changeColor(pos.x, this.shifted.y, fillStyle);
                  this.map.getCell(pos.x, this.shifted.y).render();
                } else if (this.shifted.direction == "horizontal") {
                  this.changeColor(this.shifted.x, pos.y, fillStyle);
                  this.map.getCell(this.shifted.x, pos.y).render();
                } else {
                    if (this.shifted.x) {
                        if (Math.abs(this.shifted.x - pos.x) >= 1) {
                            this.shifted.direction = "vertical";
                        } else if (Math.abs(this.shifted.y - pos.y) >= 1) {
                            this.shifted.direction = "horizontal";
                        }
                    } else {
                        this.shifted.x = pos.x;
                        this.shifted.y = pos.y;
                    }
                }
            } else {
                if (this.shifted.direction) {
                    this.shifted.reset();
                }


                if (this.latest.x != pos.x || this.latest.y != pos.y) {
                    this.latest.x = pos.x;
                    this.latest.y = pos.y;
                    this.changeCellFillstyle(pos.x, pos.y, fillStyle);
                    this.map.getCell(pos.x, pos.y).render();
                }
            }
        }
    }
}

class BucketTool extends SculptureTool {
    constructor(map, foregroundColorPicker, backgroundColorPicker) {
        super(map, foregroundColorPicker, backgroundColorPicker);
        this.icon = "format_color_fill";
        this.button = $('<button type="button" class="btn btn-default"> <span class="material-icons">' + this.icon + '</span></button>');
        this.Stack = [];
        this.cellsToFill = [];
        this.old;
        this.inListOfCurrentCells = false;
        this.listOfCurrentCells;
        this.xmin
        this.xmax
        this.ymin
        this.ymax
    }
    onClick(evt) {
        super.onClick(evt);
        var pos = this.evtToCoordinates(evt);
        pos = [Math.floor(pos.x), Math.floor(pos.y)];

        var coordString = pos[0] + "/" + pos[1]
        this.listOfCurrentCells = Object.keys(this.map.data)
        this.inListOfCurrentCells = $.inArray(coordString, this.listOfCurrentCells)
        var xAndYofCurrentCells = this.listOfCurrentCells.map(function (obj) {
            var coord = obj.split("/")
            //console.debug(coord)
            return [coord[0], coord[1]]
        });
        var xOfCurrentCells = xAndYofCurrentCells.map(function (obj) {
            return obj[0]
        })
        var yOfCurrentCells = xAndYofCurrentCells.map(function (obj) {
            return obj[1]
        })
        this.xmin = Math.min.apply(null, xOfCurrentCells)
        this.xmax = Math.max.apply(null, xOfCurrentCells)
        this.ymin = Math.min.apply(null, yOfCurrentCells)
        this.ymax = Math.max.apply(null, yOfCurrentCells)
        //console.debug("inListOfCurrentCells: " + this.inListOfCurrentCells)
        var newColor;
        if (evt.type == "click") {
            newColor = this.foregroundColor;
        } else {
            newColor = this.backgroundColor;
        }
        if (this.outside(pos[0], pos[1])) {
            this.map.fillStyle = newColor;
            this.map.render();
            return;
        }
        if (this.map.isCell(pos[0], pos[1]) && newColor == this.map.getCell(pos[0], pos[1]).fillStyle) {
            return;
        }
        this.old = this.map.getCell(pos[0], pos[1]).fillStyle;
        
        this.cellsToFill = [];
        this.Stack = [];
        //console.debug("Start flooding")
        this.floodFill(pos[0], pos[1]);
        //console.debug("Ended flooding: ", this.cellsToFill);
        for (var i = 0; i < this.cellsToFill.length; i++) {
            this.changeCellFillstyle(this.cellsToFill[i][0], this.cellsToFill[i][1], newColor);
        }
    }
    outside(x, y) {
        //console.debug("x: " + x + "\nxmin: " + this.xmin + "\nxmax: " + this.xmax + "\nymin: " + this.ymin + "\nymax: " + this.ymax)
        if (x < this.xmin || x > this.xmax || y < this.ymin || y > this.ymax) {
            return true;
        } else {
            return false;
        }
    }
    floodFill(x, y) {
        //console.debug("flood: " + x + ", " + y)
        this.fillPixel(x, y);
        while (this.Stack.length > 0) {
            this.toFill = this.Stack.pop();
            this.fillPixel(this.toFill[0], this.toFill[1]);
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
        if (!this.outside(x, y)) {
            var coordString = x + "/" + y;
            var cellsToFillStringArray = this.cellsToFill.map(function (obj) { return obj[0] + "/" + obj[1] });
            if ($.inArray(coordString, this.listOfCurrentCells) != -1) {
                return ((this.map.getCell(x, y).fillStyle != this.old) || $.inArray(coordString, cellsToFillStringArray) != -1);
            } else {
                return ($.inArray(coordString, cellsToFillStringArray) != -1 || this.inListOfCurrentCells != -1);
            }
        } else {
            return true;
        }
    }
}


class Toolbar {
    constructor(target, map) {
        this.map = map;
        this.panel = $("<div id='tb_panel' class='panel panel-default col-md-3'></div>");
        this.panel.append($("<div id='tb_body' class='panel-body'></div>"));
        this.foregroundColor = "#000000";
        this.backgroundColor = "#ffffff";
        this.addColorpickers();
        this.addTools();
        this.backgroundColorPicker.colorpicker("setValue", "#ffffff");
        target.prepend(this.panel[0]);
        var t = this;
        $(this.map.canvas).bind('contextmenu', function (e) {
            t.onClick(e);
            return false;
        });

        this.map.on("click", function (evt) { t.onClick(evt); });
        this.map.on("mouseup", function (evt) { t.onMouseUp(evt); });
        this.map.on("mousedown", function (evt) { t.onMouseDown(evt); });
        this.map.on("mousemove", function (evt) { t.onMouseMove(evt); });
    }

    addTools() {
        this.rectSelector = new RectSelectionTool(this.map);
        this.magicStick = new MagicStickTool(this.map);
        this.pencil = new PencilTool(this.map, this.foregroundColorPicker, this.backgroundColorPicker);
        this.bucket = new BucketTool(this.map, this.foregroundColorPicker, this.backgroundColorPicker); 
        var grp = $('<div class="btn-group" role="group"></div>');

        grp.append(this.rectSelector.button);
        grp.append(this.magicStick.button);
        grp.append(this.pencil.button);
        grp.append(this.bucket.button);
        var t = this;

        this.rectSelector.button.on("click", function () {
            t.setActiveTool(t.rectSelector);
        });
        this.magicStick.button.on("click", function () {
            t.setActiveTool(t.magicStick);
        });
        this.pencil.button.on("click", function () {
            t.setActiveTool(t.pencil);
        });
        this.bucket.button.on("click", function () {
            t.setActiveTool(t.bucket);
        });

        this.activeTool = this.pencil;
        //this.setActiveTool(this.pencil);
        var body = this.panel.find("#tb_body");
        body.append(grp);

    }

    addColorpickers() {
        var body = this.panel.find(".panel-body");
        this.foregroundColorPicker = $('<div id="fgCp" data-format="alias" class="input-group colorpicker-component">'
          + '<input type="text" value="primary" class="form-control" />'
          + '<span class="input-group-addon"><i></i></span>'
          + '</div>');
        this.backgroundColorPicker = $('<div id="bgCp" data-format="alias" class="input-group colorpicker-component">'
          + '<input type="text" value="primary" class="form-control" />'
          + '<span class="input-group-addon"><i></i></span>'
          + '</div>');
        var t = this;
        this.foregroundColorPicker.colorpicker().on("changeColor", function (e) {
            if (e.value) {
                t.foregroundColor = e.value;
                t.pencil.foregroundColor = e.value;
                t.bucket.foregroundColor = e.value;
            }
        });
        this.backgroundColorPicker.colorpicker().on("changeColor", function (e) {
            if (e.value) {
                t.backgroundColor = e.value;
                t.pencil.backgroundColor = e.value;
                t.bucket.backgroundColor = e.value;
            }
        });
        body.append(this.foregroundColorPicker);
        body.append(this.backgroundColorPicker);
    }

    setActiveTool(tool) {
        this.activeTool.panel.detach();
        this.activeTool = tool;
        this.panel.find(".btn").removeClass("btn-primary");
        tool.button.addClass("btn-primary");
        this.panel.find(".panel-body").append(this.activeTool.panel);
    }

    onMouseMove(evt) {
        this.activeTool.onMouseMove(evt);
    }
    onMouseUp(evt) {
        this.activeTool.onMouseUp(evt);
    }
    onMouseDown(evt) {
        this.activeTool.onMouseDown(evt);
    }
    onClick(evt) {
        this.activeTool.onClick(evt);
    }
}
