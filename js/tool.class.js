class Tool {
    constructor(toolbar) {
        this.toolbar = toolbar
        this.map = toolbar.map;
        this.icon = "";
        this.button = undefined;
        this.panel = $("<div class='panel panel-default toolSettings'></div>");
        this.panel.append($("<div class='panel-body'></div>"));
        this.cursor = {id: "default", dx: 0, dy: 0};
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

    enableCursor(){
        var canvas = $("<canvas></canvas>")[0];
        canvas.width = 24;
        canvas.height = 24;
        var ctx = canvas.getContext("2d");
        ctx.font = "26px Material Icons";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.moveTo(0,0);
        ctx.fillStyle = "#ffffff";
        ctx.fillText(this.cursor.id, 12,12);
        ctx.fillStyle = "#000000";
        ctx.font = "24px Material Icons";
        ctx.fillText(this.cursor.id, 12,12);
        var dataURL = canvas.toDataURL('image/png')
        $(this.map.canvas).css('cursor', 'url('+dataURL+') ' + this.cursor.dx + ' ' + this.cursor.dy + ', auto');
    }

}

class SelectionTool extends Tool {
    constructor(toolbar) {
        super(toolbar);
    }

}

class RectSelectionTool extends SelectionTool {
    constructor(toolbar) {
        super(toolbar);
        this.icon = "crop_free";
        this.cursor.id = this.icon;
        this.button = $('<button type="button" class="btn  btn-default"> <span class="material-icons">' + this.icon + '</span></button>');
    }
}

class MagicStickTool extends SelectionTool {
    constructor(toolbar) {
        super(toolbar);
        this.icon = "open_with";
        this.cursor = {id: "open_with", dx: 10, dy: 10};
        this.button = $('<button type="button" class="btn  btn-default"> <span class="material-icons">' + this.icon + '</span></button>');
        this.Stack = [];
        this.cellsToFill = [];
        this.old;
        this.inListOfCurrentCells = false;
        this.listOfCurrentCells;
        this.listOfCurrentlyHighlighted = [];
        this.xmin
        this.xmax
        this.ymin
        this.ymax
    }
    onClick(evt) {
        this.listOfCurrentlyHighlighted = this.listOfCurrentlyHighlighted.concat(this.cellsToFill)
        console.debug("listOfCurrentlyHighlighted: ", this.listOfCurrentlyHighlighted)
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
        var highlight;
        //console.debug("inListOfCurrentCells: " + this.inListOfCurrentCells)
        if (this.map.isCell(pos[0], pos[1])){
            var cell = this.map.getCell(pos[0], pos[1]);
            highlight = !cell.highlight;
            this.old = this.map.getCell(pos[0], pos[1]).fillStyle;
            this.Stack = [];
            this.floodFill(pos[0], pos[1]);
            console.debug("neu: ", this.cellsToFill)
        } else {
            highlight = false;
            this.cellsToFill = this.listOfCurrentlyHighlighted;
        }
        for (var i = 0; i < this.cellsToFill.length; i++) {
            var cellToFill = this.map.getCell(this.cellsToFill[i][0], this.cellsToFill[i][1]);
            cellToFill.highlight = highlight;
            cellToFill.render();
        }
        if (highlight == false) {
            var t = this;
            this.cellsToFill.map(function (obj) {
                var index = t.listOfCurrentlyHighlighted.indexOf(obj);
                if (index > -1) {
                    t.listOfCurrentlyHighlighted.splice(index, 1);
                }
            })
            this.cellsToFill = []
        }
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
    constructor(toolbar, foregroundColorPicker, backgroundColorPicker) {
        super(toolbar);
        this.foregroundColor = "#000000";
        this.backgroundColor = "#ffffff";
        this.foregroundColorPicker = foregroundColorPicker;
        this.backgroundColorPicker = backgroundColorPicker;
        this.latestColors = [];
    }
    addSize() {
        var body = this.panel.find(".panel-body");
    }

    changeCellFillstyle(x, y, fillStyle, render=true){
        if (this.map.fillStyle == fillStyle){
            if (this.map.isCell(x,y)){
                this.map.removeCell(x, y);
                if (render){
                    this.map.render();
                }
                return true;
            } else {
                return false;
            }
        } else if (this.fillStyle != this.map.getCell(x,y).fillStyle) {
            this.map.changeCellFillstyle(x, y, fillStyle, render)
            return true;
        } else {
            return false;
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
                return true;
            }
            return false;
        }

    }

    class PathTool extends SculptureTool {
        constructor(toolbar, foregroundColorPicker, backgroundColorPicker) {
        super(toolbar, foregroundColorPicker, backgroundColorPicker);
        this.icon = "linear_scale";
        this.button = $('<button type="button" class="btn  btn-default"> <span class="material-icons">' + this.icon + '</span></button>');
        this.positions = [];
        this.wasShifted = false;
        this.previewPositions = [];
        this.latest = {x:0, y:0};
    }
    onMouseDown(evt){
        if(!super.onClick(evt)){
            var fillStyle = evt.which == 1 ? this.foregroundColor : this.backgroundColor;
            var pos = this.evtToCoordinates(evt);
            pos.x = Math.floor(pos.x);
            pos.y = Math.floor(pos.y);
            pos.which = evt.which;
            this.latest.which = evt.which;

            var t = this;
            this.positions.push(pos);
            if(evt.shiftKey){
                if(this.positions.length == 2){
                    var line = this.line(this.positions[0].x, this.positions[0].y, this.positions[1].x, this.positions[1].y, fillStyle);
                    line.forEach(function(pos){
                        t.changeCellFillstyle(pos.x, pos.y, fillStyle);
                    });
                    this.positions.splice(0,1);
                    this.wasShifted = true;
                }
            }else{
                if(this.wasShifted){
                    this.wasShifted = false;
                }
                if(this.positions.length == 2){
                    var line = this.line(this.positions[0].x, this.positions[0].y, this.positions[1].x, this.positions[1].y, fillStyle);
                    line.forEach(function(pos){
                        t.changeCellFillstyle(pos.x, pos.y, fillStyle);
                    });
                    this.positions = [];
                }
            }
            this.previewPositions.forEach(function(p){
                t.map.removeCell(p.x, p.y, -1);
            });
        }
    }

    onMouseMove(evt){
        var pos = this.evtToCoordinates(evt);
        pos.x = Math.floor(pos.x);
        pos.y = Math.floor(pos.y);
        var fillStyle = this.latest.which == 1 ? this.foregroundColor : this.backgroundColor;
        if(this.positions.length > 0){
            if (this.latest.x != pos.x || this.latest.y != pos.y) {
                var t = this;
                this.previewPositions.forEach(function(p){
                    t.map.removeCell(p.x, p.y, -1);
                });
                this.previewPositions = [];
                this.latest.x = pos.x;
                this.latest.y = pos.y;
                this.previewPositions = this.line(this.positions[0].x, this.positions[0].y, pos.x, pos.y);
                this.previewPositions.forEach(function(p){
                    t.map.getCell(p.x, p.y, -1);
                    t.map.data[-1][p.x][p.y] = "#ff00ff";

                });
                this.map.render();
            }
        }
    }

    line(x0, y0, x1, y1, fillStyle){
        var dx =  Math.abs(x1-x0);
        var sx = x0<x1 ? 1 : -1;
        var dy = -Math.abs(y1-y0)
        var sy = y0<y1 ? 1 : -1;
        var err = dx+dy, e2;
        var i = 0;

        var line = [];
        while(1 && i++ < 200){
            line.push({x: x0, y: y0});
            if (x0==x1 && y0==y1) break;
            e2 = 2*err;
            if (e2 > dy) { err += dy; x0 += sx; }
            if (e2 < dx) { err += dx; y0 += sy; }
        }
        return line;
    }
}

class PencilTool extends SculptureTool {
    constructor(toolbar, foregroundColorPicker, backgroundColorPicker) {
        super(toolbar, foregroundColorPicker, backgroundColorPicker);
        this.size = 1;
        this.icon = "edit"
        this.cursor = {id: "edit", dx: 2, dy: 20};
        this.button = $('<button type="button" class="btn  btn-default"> <span class="material-icons">' + this.icon + '</span></button>');
        this.mouseDown = false;
        this.latest = { x: 0, y: 0 };
        this.shifted = { x: undefined, y: undefined, direction: undefined, reset: function () { this.x = undefined; this.y = undefined; this.direction = undefined; } };
        this.drawn = []
        this.oldColor;
        this.newColor;
    }

    onMouseDown(evt){
        var pos = this.evtToCoordinates(evt);
        pos.x = Math.floor(pos.x);
        pos.y = Math.floor(pos.y);
        this.oldColor = this.map.getCell(pos.x, pos.y).fillStyle;
        if (evt.which == 1) {
            this.newColor = this.foregroundColor;
        } else if (evt.which == 3) {
            this.newColor = this.backgroundColor;
        }
        if (this.changeCellFillstyle(pos.x, pos.y, this.newColor)){
            this.drawn.push({x: pos.x, y: pos.y, oldC: this.oldColor})
            if (this.map.isCell(pos.x, pos.y)){
                //this.map.newCommand(new PencilClickCommand(this, pos.x, pos.y, oldColor, newColor), this.toolbar);
                this.map.getCell(pos.x, pos.y).render()
            }
        }
        if(evt.which == 1 || evt.which == 3){
            this.mouseDown = true;
        }
    }

    onMouseUp(evt){
        this.mouseDown = false;
        var drawnlength = this.drawn.length
        if(drawnlength > 1 && this.drawn[0].x == this.drawn[1].x && this.drawn[0].y == this.drawn[1].y){
            this.drawn.splice(1,1)
        }
        this.map.newCommand(new SculptureCommand(this, this.drawn, this.newColor), this.toolbar);
        this.drawn = []
    }

    onMouseMove(evt) {
        if (!evt.shiftKey) {
            this.shifted.reset();
        }
        if ((evt.which == 1 || evt.which == 3) && this.mouseDown) {
            var pos = this.evtToCoordinates(evt);
            pos.x = Math.floor(pos.x);
            pos.y = Math.floor(pos.y);
            if (evt.shiftKey) {
                if (this.shifted.direction == "vertical") {
                    var oldC = this.map.getCell(pos.x, pos.y).fillStyle
                    this.changeCellFillstyle(pos.x, this.shifted.y, this.newColor);
                    this.drawn.push({x: pos.x, y: this.shifted.y, oldC: oldC})
                    this.map.getCell(pos.x, this.shifted.y).render();
                } else if (this.shifted.direction == "horizontal") {
                    var oldC = this.map.getCell(pos.x, pos.y).fillStyle
                    this.changeCellFillstyle(this.shifted.x, pos.y, this.newColor);
                    this.drawn.push({x: this.shifted.x,y: pos.y, oldC: oldC})
                    this.map.getCell(this.shifted.x, pos.y).render();
                } else {
                    if (this.shifted.x || this.shifted.y) {
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
                    var oldC = this.map.getCell(pos.x, pos.y).fillStyle
                    if (this.changeCellFillstyle(pos.x, pos.y, this.newColor)){
                        this.drawn.push({x: pos.x, y: pos.y, oldC: oldC})
                        if (this.map.isCell(pos.x, pos.y)){
                            this.map.getCell(pos.x, pos.y).render()
                        }
                    }
                }
            }
        }
    }
}

class BucketTool extends SculptureTool {
    constructor(toolbar, foregroundColorPicker, backgroundColorPicker) {
        super(toolbar, foregroundColorPicker, backgroundColorPicker);
        this.icon = "format_color_fill";
        this.cursor.id = this.icon;
        this.button = $('<button type="button" class="btn  btn-default"> <span class="material-icons">' + this.icon + '</span></button>');
        this.Stack = [];
        this.cellsToFill = [];
        this.old;
        this.inListOfCurrentCells = false;
        this.listOfCurrentCells;
        this.xmin
        this.xmax
        this.ymin
        this.ymax
        this.abort = false;
    }
    onClick(evt) {
        super.onClick(evt);
        var pos = this.evtToCoordinates(evt);
        var x = Math.floor(pos.x)
        var y = Math.floor(pos.y)
        this.listOfCurrentCells = this.map.getCurrentCells(x, y);
        this.inListOfCurrentCells = this.map.isCell(x,y)
        this.coordsOfCurrentCells = this.listOfCurrentCells.map(function (obj) {
            return [obj.x, obj.y]
        });
        var xOfCurrentCells = this.coordsOfCurrentCells.map(function (obj) {
            return obj[0]
        });
        var yOfCurrentCells = this.listOfCurrentCells.map(function (obj) {
            return obj[1]
        });
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
        //console.debug("x/y: " + x + "/" + y + "\nxMin/xMax: " + this.xmin + "/" + this.xmax + "\nyMin/yMax: " + this.ymin + "/" + this.ymax)
        if (!this.outside(x, y)) {
            if (this.map.isCell(x,y)){
                this.old = this.map.getCell(x, y).fillStyle;
                if (newColor == this.old){
                    return;
                }
            } else {
                this.old = this.map.fillStyle;
            }
            this.cellsToFill = [];
            this.Stack = [];
            //console.debug("Start flooding")
            this.floodFill(x, y);
            //console.debug("Ended flooding: ", this.cellsToFill);
            if (!this.abort){
                var newColorIsBackgroundColor = (newColor == this.map.fillStyle)
                for (var i = 0; i < this.cellsToFill.length; i++) {
                    this.changeCellFillstyle(this.cellsToFill[i][0], this.cellsToFill[i][1], newColor, false);
                }
                this.map.render();
            } else {
                this.map.fillStyle = newColor;
                this.map.render();
            }
        } else {
            this.map.fillStyle = newColor;
            this.map.render();
        }
        //console.debug("ABORT: " + this.abort);
        this.abort = false;
    }
    outside(x, y) {
        //console.debug("x/y: " + x + "/" + y + "\nxMin/xMax: " + this.xmin + "/" + this.xmax + "\nyMin/yMax: " + this.ymin + "/" + this.ymax)
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
        //console.debug(x +"/"+ y + " innerhalb: " + !this.outside(x,y) + " KlickAufZelle: " + this.inListOfCurrentCells)
        if ((!this.outside(x,y) || this.inListOfCurrentCells) && !this.abort){
            var coord = [x,y];
            var inCellsToFill = this.cellsToFill.contains(coord);
            if (this.coordsOfCurrentCells.contains(coord)) {
                return ((this.map.getCell(x, y).fillStyle != this.old) || inCellsToFill);
            } else {
                return (inCellsToFill || this.inListOfCurrentCells);
            }
        } else {
            this.Stack = []
            this.abort = true;
            return true;
        }
    }
}


class Toolbar {
    constructor(target, map) {
        this.map = map;
        this.panel = $('<div id="tb_panel" class="text-center"></div>');
        this.form = $("<div></div>", {"class": "navbar-form form-group"});
        this.panel.append(this.form[0]);
        this.foregroundColor = "#000000";
        this.backgroundColor = "#ffffff";
        this.addColorpickers();
        this.addTools();
        this.addUndoRedoButtons();
        this.form.children().css('padding-right', '10px');
        this.customCursor = false;
        this.backgroundColorPicker.colorpicker("setValue", "#eeeeee");
        target.append(this.panel[0]);
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
        this.rectSelector = new RectSelectionTool(this);
        this.magicStick = new MagicStickTool(this);
        this.pencil = new PencilTool(this, this.foregroundColorPicker, this.backgroundColorPicker);
        this.bucket = new BucketTool(this, this.foregroundColorPicker, this.backgroundColorPicker);
        this.path = new PathTool(this, this.foregroundColorPicker, this.backgroundColorPicker);

        var grp = $('<div class="btn-group" role="group"></div>');

        //grp.append(this.rectSelector.button);
        //grp.append(this.magicStick.button);
        grp.append(this.pencil.button);
        grp.append(this.path.button);
        grp.append(this.bucket.button);
        var t = this;

        this.path.button.on("click", function () {
            t.setActiveTool(t.path);
        });
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
        this.setActiveTool(this.pencil);
        //form.append(grp);
        this.form.prepend(grp);

    }

    addColorpickers() {
        this.foregroundColorPicker = $('<button id="fgCp" class="btn btn-default">'
          //+ '<input type="text" value="primary" class="form-control" />'
          + '<span class="material-icons">lens</span>'
          + '</button>');
        this.backgroundColorPicker = $('<button id="bgCp" class="btn btn-default">'
          + '<span class="material-icons">lens</span>'
          + '</button>');
        var t = this;
        this.foregroundColorPicker.on("click", function(){ t.foregroundColorPicker.colorpicker("show"); });
        this.backgroundColorPicker.on("click", function(){ t.backgroundColorPicker.colorpicker("show"); });
        var defaultColors = { '#000000': '#000000',
            '#ffffff': '#ffffff',
            '#FF0000': '#FF0000',
            '#777777': '#777777',
            '#337ab7': '#337ab7',
            '#5cb85c': '#5cb85c',
            '#5bc0de': '#5bc0de',
            '#f0ad4e': '#f0ad4e',
            '#d9534f': '#d9534f'};
        this.foregroundColorPicker.colorpicker({"color": this.foregroundColor, "colorSelectors":defaultColors}).on("changeColor", function (e) {
            var color = t.foregroundColorPicker.colorpicker("getValue")
            t.foregroundColorPicker.find("span").css("color", color);
            t.foregroundColor = color;
            t.pencil.foregroundColor = color;
            t.bucket.foregroundColor = color;
            t.path.foregroundColor = color;
        });
        this.backgroundColorPicker.colorpicker({"color":this.backgroundColor, "colorSelectors":defaultColors}).on("changeColor", function (e) {
            var color = t.backgroundColorPicker.colorpicker("getValue")
            t.backgroundColorPicker.find("span").css("color", color);
            t.backgroundColor = color;
            t.pencil.backgroundColor = color;
            t.bucket.backgroundColor = color;
            t.path.backgroundColor = color;
        });
        var btnGrp = $("<div class='btn-group'></div>");
        btnGrp.append(this.foregroundColorPicker);
        btnGrp.append(this.backgroundColorPicker);
        this.form.append(btnGrp);
    }

    addUndoRedoButtons(){
        this.buttonUndo = $('<button id="UndoButton" type="button" class="btn  btn-default disabled"> <span class="material-icons">' + "undo" + '</span></button>');
        this.buttonRedo = $('<button id="RedoButton" type="button" class="btn  btn-default disabled"> <span class="material-icons">' + "redo" + '</span></button>');

        var t = this;
        this.buttonUndo.on("click", function(){
            if(!t.buttonUndo.hasClass("disabled")) {
                t.map.history[t.map.historyIndex].undo()
                t.checkUndoAndRedoButton()
            } });
        this.buttonRedo.on("click", function(){ 
            if(!t.buttonRedo.hasClass("disabled")) {
                t.map.history[t.map.historyIndex + 1].redo()
                t.checkUndoAndRedoButton()
            } });
        var btnGrp = $("<div class='btn-group'></div>");
        btnGrp.append(this.buttonUndo);
        btnGrp.append(this.buttonRedo);
        this.form.prepend(btnGrp);
    }

    checkUndoAndRedoButton(){
        if(this.map.historyIndex == -1){
            this.buttonUndo.addClass("disabled")
        } else {
            this.buttonUndo.removeClass("disabled")
        }
        if(this.map.historyIndex == this.map.history.length - 1){
            this.buttonRedo.addClass("disabled")
        } else {
            this.buttonRedo.removeClass("disabled")
        }

    }

    setActiveTool(tool) {
        this.activeTool.panel.detach();
        this.activeTool = tool;
        this.panel.find(".btn").removeClass("btn-primary");
        tool.button.addClass("btn-primary");
        this.panel.find(".panel-body").append(this.activeTool.panel);
        if(this.customCursor){
            this.activeTool.enableCursor();
        }else{
            $("body").css('cursor', 'default');
        }
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
