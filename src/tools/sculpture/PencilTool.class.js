import {SculptureTool} from "./SculptureTool.class";

export class PencilTool extends SculptureTool {
  constructor(toolbar, foregroundColorPicker, backgroundColorPicker) {
    super(toolbar, foregroundColorPicker, backgroundColorPicker);
    this.size = 1;
    this.icon = "edit";
    this.cursor = { id: "edit", dx: 2, dy: 20 };
    this.button = $('<button type="button" class="btn  btn-default"> <span class="material-icons">' + this.icon + '</span></button>');
    this.mouseDown = false;
    this.latest = { x: undefined, y: undefined, reset: function () { this.x = undefined; this.y = undefined; } };
    this.shiftdown = false;
    this.shifted = { x: undefined, y: undefined, direction: undefined, reset: function () { this.x = undefined; this.y = undefined; this.direction = undefined; } };
  }
  onMouseDown(evt) {
    this.mouseDown = true;
    if (evt.which == 1) {
      this.newColor = this.foregroundColor;
    } else {
      this.newColor = this.backgroundColor;
    }
  }
  onMouseUp(evt) {
    this.mouseDown = false;
    if (this.drawn.length == 0){
      var pos = this.evtToCoordinates(evt);
      pos.x = Math.floor(pos.x);
      pos.y = Math.floor(pos.y);
      console.debug(pos.x, pos.y);
      this.checkCoord(pos.x, pos.y);
    }
    this.commitSculptureCommand();
    this.latest.reset();
  }
  onMouseMove(evt) {
    if (evt.shiftKey && this.shiftdown == false) {
      this.shiftdown = true;
    } else if (!evt.shiftKey && this.shiftdown == true) {
      this.shiftdown = false;
      this.shifted.reset();
    }
    if (this.mouseDown) {
      var pos = this.evtToCoordinates(evt);
      pos.x = Math.floor(pos.x);
      pos.y = Math.floor(pos.y);
      if (!this.shiftdown) {
        this.checkCoord(pos.x, pos.y);
      } else {
        if (!this.shifted.x || !this.shifted.y) {
          this.shifted.x = pos.x;
          this.shifted.y = pos.y;
        }
        if (!this.shifted.direction) {
          if (pos.x != this.shifted.x) {
            this.shifted.direction = "h";
          } else if (pos.y != this.shifted.y) {
            this.shifted.direction = "v";
          }
        }
        if (this.shifted.direction == "h") {
          this.checkCoord(pos.x, this.shifted.y);
        } else if (this.shifted.direction == "v") {
          this.checkCoord(this.shifted.x, pos.y);
        }
      }
    }
  }

  checkCoord(x, y) {
    if (this.latest.x != x || this.latest.y != y) {
      this.latest.x = x;
      this.latest.y = y;
      var oldColor = this.map.getFillstyle(x, y);
      if (this.newColor != oldColor) {
        this.changeCellFillstyle(x, y, this.newColor);
        this.drawn.push({ x: x, y: y, oldC: oldColor });
        if (this.map.isCell(x, y)) {
          this.map.getCell(x, y).render();
        }
      }
    }
  }
}
