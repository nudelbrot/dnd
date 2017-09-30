import {Tool} from "../Tool.class";
import {Command} from "../../map/History.class";

export class SculptureTool extends Tool {
  constructor(toolbar) {
    super(toolbar);
    this.foregroundColor = "#000000";
    this.backgroundColor = "#ffffff";
    this.latestColors = [];
    this.drawn = [];
    this.newColor = undefined;
  }

  addSize() {
    var body = this.panel.find(".panel-body");
  }
  changeCellFillstyle(x, y, fillStyle, render = true) {
    if (this.map.fillStyle == fillStyle) {
      if (this.map.isCell(x, y)) {
        this.map.removeCell(x, y);
        if (render) {
          this.map.render();
        }
        return true;
      } else {
        return false;
      }
    } else if (this.fillStyle != this.map.getCell(x, y).fillStyle) {
      this.map.changeCellFillstyle(x, y, fillStyle, render);
      return true;
    } else {
      return false;
    }
  }

  onClick(evt) {
    if (evt.ctrlKey) {
      var pos = this.evtToCoordinates(evt);
      pos.x = Math.floor(pos.x);
      pos.y = Math.floor(pos.y);
      var picker = this.toolbar.backgroundColorPicker;
      if (evt.type == "click") {
        picker = this.toolbar.foregroundColorPicker;
      }
      if (this.map.isCell(pos.x, pos.y)) {
        picker.setColor(this.map.getCell(pos.x, pos.y).fillStyle);
      } else {
        picker.setColor(this.map.fillStyle);
      }
      return true;
    }
    return false;
  }

  commitSculptureCommand() {
    if (this.drawn.length != 0) {
      this.map.newCommand(new SculptureCommand(this, this.drawn, this.newColor), this.toolbar);
    }
    this.drawn = [];
  }

  commitChangeBackgroundCommand(oldMapColor){
    if (this.newColor != oldMapColor){
      this.map.newCommand(new ChangeBackgroundCommand(this.map, oldMapColor, this.newColor), this.toolbar);
    }
  }
}

class SculptureCommand extends Command {
  constructor(sculptureTool, listOfCoords, newColor) {
    super();
    this.sculptureTool = sculptureTool;
    this.map = sculptureTool.map;
    this.listOfCoords = listOfCoords;
    this.newColor = newColor;
  }

  redo() {
    var t = this;
    this.listOfCoords.forEach((coord) => this.sculptureTool.changeCellFillstyle(coord.x, coord.y, this.newColor, false));
    this.map.render();
    this.map.historyIndex++;
  }

  undo() {
    var t = this;
    this.listOfCoords.forEach((coord) => this.sculptureTool.changeCellFillstyle(coord.x, coord.y, coord.oldC, false));
    this.map.render();
    this.map.historyIndex--;
  }
}

class ChangeBackgroundCommand extends Command {
    constructor(map, oldMapColor, newMapColor) {
        super();
        this.map = map;
        this.oldMapColor = oldMapColor;
        this.newMapColor = newMapColor;
    }
    redo() {
        this.map.fillStyle = this.newMapColor;
        this.map.render();
        this.map.historyIndex++;
    }
    undo() {
        this.map.fillStyle = this.oldMapColor;
        this.map.render();
        this.map.historyIndex--;
    }
}
