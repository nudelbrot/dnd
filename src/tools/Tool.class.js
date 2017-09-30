export class Tool {
  constructor(toolbar) {
    this.toolbar = toolbar;
    this.map = toolbar.map;
    this.icon = "";
    this.button = undefined;
    this.panel = $("<div class='panel panel-default toolSettings'></div>");
    this.panel.append($("<div class='panel-body'></div>"));
    this.cursor = { id: "default", dx: 0, dy: 0 };
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
    return { x: (evt.offsetX / this.map.cellWidth) - this.map.translation.x, y: (evt.offsetY / this.map.cellHeight)  - this.map.translation.y };
  }

  enableCursor() {
    var canvas = $("<canvas></canvas>")[0];
    canvas.width = 24;
    canvas.height = 24;
    var ctx = canvas.getContext("2d");
    ctx.font = "26px Material Icons";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.moveTo(0, 0);
    ctx.fillStyle = "#ffffff";
    ctx.fillText(this.cursor.id, 12, 12);
    ctx.fillStyle = "#000000";
    ctx.font = "24px Material Icons";
    ctx.fillText(this.cursor.id, 12, 12);
    var dataURL = canvas.toDataURL('image/png');
    $(this.map.canvas).css('cursor', 'url(' + dataURL + ') ' + this.cursor.dx + ' ' + this.cursor.dy + ', auto');
  }
}
