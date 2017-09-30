import {SculptureTool} from "./SculptureTool.class";

export class PathTool extends SculptureTool {
  constructor(toolbar, foregroundColorPicker, backgroundColorPicker) {
    super(toolbar, foregroundColorPicker, backgroundColorPicker);
    this.icon = "linear_scale";
    this.button = $('<button type="button" class="btn  btn-default"> <span class="material-icons">' + this.icon + '</span></button>');
    this.positions = [];
    this.wasShifted = false;
    this.previewPositions = [];
    this.latest = { x: 0, y: 0 };
  }
  onMouseDown(evt) {
    if (!super.onClick(evt)) {
      this.newColor = evt.which == 1 ? this.foregroundColor : this.backgroundColor;
      var pos = this.evtToCoordinates(evt);
      pos.x = Math.floor(pos.x);
      pos.y = Math.floor(pos.y);
      pos.which = evt.which;
      var t = this;
      if (this.positions.length > 0 && this.latest.which != evt.which) {
        this.positions = [];
      } else {
        this.latest.which = evt.which;
        this.positions.push(pos);
        if (evt.shiftKey) {
          if (this.positions.length == 2) {
            var hline = this.line(this.positions[0].x, this.positions[0].y, this.positions[1].x, this.positions[1].y, this.newColor);
            hline.forEach(function (pos) {
                t.changeCellFillstyle(pos.x, pos.y, t.newColor, false);
                });
            this.drawn = hline;
            this.positions.splice(0, 1);
            this.wasShifted = true;
          }
        } else {
          if (this.wasShifted) {
            this.wasShifted = false;
          }
          if (this.positions.length == 2) {
            var vline = this.line(this.positions[0].x, this.positions[0].y, this.positions[1].x, this.positions[1].y, this.newColor);
            vline.forEach(function (pos) {
                t.changeCellFillstyle(pos.x, pos.y, t.newColor, false);
                });
            this.drawn = vline;
            this.positions = [];
          }
        }
      }
      this.previewPositions.forEach(function (p) {
          t.map.removeCell(p.x, p.y, -1);
          });
      this.commitSculptureCommand();
      this.map.render();
    }
  }

  onMouseMove(evt) {
    var pos = this.evtToCoordinates(evt);
    pos.x = Math.floor(pos.x);
    pos.y = Math.floor(pos.y);
    var fillStyle = this.latest.which == 1 ? this.foregroundColor : this.backgroundColor;
    if (this.positions.length > 0) {
      if (this.latest.x != pos.x || this.latest.y != pos.y) {
        var t = this;
        this.previewPositions.forEach(function (p) {
            t.map.removeCell(p.x, p.y, -1);
            });
        this.previewPositions = [];
        this.latest.x = pos.x;
        this.latest.y = pos.y;
        this.previewPositions = this.line(this.positions[0].x, this.positions[0].y, pos.x, pos.y);
        this.previewPositions.forEach(function (p) {
            t.map.getCell(p.x, p.y, -1);
            t.map.data[-1][p.x][p.y] = "#ff00ff";

            });
        this.map.render();
      }
    }
  }

  line(x0, y0, x1, y1, fillStyle) {
    var dx = Math.abs(x1 - x0);
    var sx = x0 < x1 ? 1 : -1;
    var dy = -Math.abs(y1 - y0);
    var sy = y0 < y1 ? 1 : -1;
    var err = dx + dy, e2;
    var i = 0;

    var line = [];
    while (1 && i++ < 200) {
      line.push({ x: x0, y: y0, oldC: this.map.getFillstyle(x0, y0) });
      if (x0 == x1 && y0 == y1) break;
      e2 = 2 * err;
      if (e2 > dy) { err += dy; x0 += sx; }
      if (e2 < dx) { err += dx; y0 += sy; }
    }
    return line;
  }
}
