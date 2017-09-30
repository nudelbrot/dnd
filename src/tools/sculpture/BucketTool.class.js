import {SculptureTool} from "./SculptureTool.class";

export class BucketTool extends SculptureTool {
  constructor(toolbar, foregroundColorPicker, backgroundColorPicker) {
    super(toolbar, foregroundColorPicker, backgroundColorPicker);
    this.icon = "format_color_fill";
    this.cursor.id = this.icon;
    this.button = $('<button type="button" class="btn  btn-default"> <span class="material-icons">' + this.icon + '</span></button>');
    this.Stack = [];
    this.cellsToFill = [];
    this.old = undefined;
    this.inListOfCurrentCells = false;
    this.listOfCurrentCells = undefined;
    this.xmin = undefined;
    this.xmax = undefined;
    this.ymin = undefined;
    this.ymax = undefined;
    this.abort = false;
  }
  onClick(evt) {
    super.onClick(evt);
    var pos = this.evtToCoordinates(evt);
    var x = Math.floor(pos.x);
    var y = Math.floor(pos.y);
    this.listOfCurrentCells = this.map.getCurrentCells();
    this.inListOfCurrentCells = this.map.isCell(x, y);
    this.coordsOfCurrentCells = this.listOfCurrentCells.map(function (obj) {
      return [obj.x, obj.y];
    });
    var xOfCurrentCells = this.coordsOfCurrentCells.map(function (obj) {
      return obj[0];
    });
    var yOfCurrentCells = this.listOfCurrentCells.map(function (obj) {
      return obj[1];
    });
    this.xmin = Math.min.apply(null, xOfCurrentCells);
    this.xmax = Math.max.apply(null, xOfCurrentCells);
    this.ymin = Math.min.apply(null, yOfCurrentCells);
    this.ymax = Math.max.apply(null, yOfCurrentCells);
    //console.debug("inListOfCurrentCells: " + this.inListOfCurrentCells)
    if (evt.type == "click") {
      this.newColor = this.foregroundColor;
    } else {
      this.newColor = this.backgroundColor;
    }
    //console.debug("x/y: " + x + "/" + y + "\nxMin/xMax: " + this.xmin + "/" + this.xmax + "\nyMin/yMax: " + this.ymin + "/" + this.ymax)
    if (!this.outside(x, y)) {
      if (this.map.isCell(x, y)) {
        this.old = this.map.getCell(x, y).fillStyle;
        if (this.newColor == this.old) {
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
      if (!this.abort) {
        var newColorIsBackgroundColor = (this.newColor == this.map.fillStyle);
        for (var i = 0; i < this.cellsToFill.length; i++) {
          x = this.cellsToFill[i][0];
          y = this.cellsToFill[i][1];
          this.changeCellFillstyle(x, y, this.newColor, false);
          this.drawn.push({x: x, y: y, oldC: this.old});
        }
        this.map.render();
        this.commitSculptureCommand();
      } else {
        this.commitChangeBackgroundCommand(this.map.fillStyle);
        this.map.fillStyle = this.newColor;
        this.map.render();
      }
    } else {
      this.commitChangeBackgroundCommand(this.map.fillStyle);
      this.map.fillStyle = this.newColor;
      this.map.render();
    }
    //console.debug("ABORT: " + this.abort);
    this.abort = false;
  }
  outside(x, y) {
    //console.debug("x/y: " + x + "/" + y + "\nxMin/xMax: " + this.xmin + "/" + this.xmax + "\nyMin/yMax: " + this.ymin + "/" + this.ymax)
    return (x < this.xmin || x > this.xmax || y < this.ymin || y > this.ymax);
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
    if ((!this.outside(x, y) || this.inListOfCurrentCells) && !this.abort) {
      var coord = [x, y];
      var inCellsToFill = this.cellsToFill.contains(coord);
      if (this.coordsOfCurrentCells.contains(coord)) {
        return ((this.map.getCell(x, y).fillStyle != this.old) || inCellsToFill);
      } else {
        return (inCellsToFill || this.inListOfCurrentCells);
      }
    } else {
      this.Stack = [];
      this.abort = true;
      return true;
    }
  }
}
BucketTool.register(3);
