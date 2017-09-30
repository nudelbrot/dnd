import {Tool} from "../Tool.class";

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
    this.cursor = { id: "open_with", dx: 10, dy: 10 };
    this.button = $('<button type="button" class="btn  btn-default"> <span class="material-icons">' + this.icon + '</span></button>');
    this.Stack = [];
    this.cellsToFill = [];
    this.old = undefined;
    this.inListOfCurrentCells = false;
    this.listOfCurrentCells = undefined;
    this.listOfCurrentlyHighlighted = [];
    this.xmin = undefined;
    this.xmax = undefined;
    this.ymin = undefined;
    this.ymax = undefined;
  }
}
