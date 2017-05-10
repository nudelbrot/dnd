class Tool {
  constructor(map){
    map.on("mousemove", this.onMouseMove);
    map.on("mouseup", this.onMouseUp);
    map.on("mousedown", this.onMouseDown);
    map.on("click", this.click);
    this.icon = "";
  }
  onMouseMove(evt){
  }
  onMouseUp(evt){
  }
  onMouseDown(evt){
  }
  onClick(evt){
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
    this.icon = "glyphicons-vector-path-all";
  }
}

class MagicStickTool extends SelectionTool {
  constructor(map) {
    super(map);
    this.icon = "glyphicons-magic"
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
    this.icon = "glyphicons-pencil"
  }
}

class PickerTool extends SculptureTool {
  constructor(map) {
    super(map);
    this.icon = "glyphicons-eyedropper"
  }
}

class BucketTool extends SculptureTool {
  constructor(map) {
    super(map);
    this.icon = "glyphicons-bucket"
  }
}

class HeightTool extends SculptureTool {
  constructor(map) {
    super(map);
  }
}

