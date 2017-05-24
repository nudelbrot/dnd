class Pattern {
  constructor(name){
    this.name = name;
    this.canvas = $("<canvas></canvas>");
    this.cached = undefined;
  }
  getPattern(){
    return this.cached? this.cached : this.render();
  }
  render(){}
}

class RectPattern extends Pattern{
  constructor(){
    super("Rect");
  }

  render(color = "rgba(255,255,255,0)", width=64, height=64){
    var ctx = this.canvas[0].getContext("2d");
    ctx.canvas.width = width;
    ctx.canvas.height = height;
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = "#ffffff";
    ctx.beginPath();
    for(var i = 1; i < 10; ++i){
      ctx.moveTo(0, i* height/10.0);
      ctx.lineTo(width, i * height/10.0);
    }
    ctx.stroke();
    var img = new Image(width, height);
    img.src = this.canvas[0].toDataURL();
    //window.open(img.src,'_blank');
    this.cached = ctx.createPattern(img, "no-repeat");
    return this.cached;
  }
}

class DoorPattern extends Pattern{
  constructor(){
    super("Door");
  }

}

class PatternPicker extends SculptureTool{
  constructor(toolbar, fgpicker, bgpicker){
    super(toolbar, fgpicker, bgpicker);
    this.patterns = [];
    this.color = "#000000";
    this.selectedPattern = undefined;
    this.preparePatterns();
    this.prepareUI();

  }

  onMouseDown(evt) {
    this.mouseDown = true;
    if (evt.which == 1) {
      this.newColor = this.selectedPattern.getPattern();
    }
    this.commitSculptureCommand();
    console.debug(this.map.data);
  } 
  onClick(evt){}
  onMouseUp(evt){}
  onMouseMove(evt){}

  changeCellFillstyle(x, y, fillStyle, render = true) {
      if (this.map.isCell(x, y, z) && this.map.fillStyle == fillStyle) {
        this.map.removeCell(x, y);
        if (render) {
          this.map.render();
        }
        return true;
    } else if (this.fillStyle != this.map.getCell(x, y).fillStyle) {
      this.map.changeCellFillstyle(x, y, fillStyle, render)
      return true;
    }
    return false;
  }


  prepareUI(){
    this.container = $('<div class="btn-group"></div>');
    this.button = $('<button id="patternPicker" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span class="material-icons">format_paint</span><span class="caret"></span></button>');
    this.patternList = $('<ul class="dropdown-menu"></ul>');
    this.container.append(this.button, this.patternList);

    var t = this;
    this.patterns.forEach(function(pattern){
      if(pattern instanceof Pattern){
        var entry = $('<li><a href="#">'+ pattern.name +'</a></li>');
        entry.on("click", function(e){
          t.selectedPattern = pattern;
        });
        t.patternList.append(entry);
      }
    });
  }

  preparePatterns(){
    var rect = new RectPattern();
    var door = new DoorPattern("Door");
    var stairway = new Pattern("Stairway");
    var stripes = new Pattern("Stripes");
    var circle = new Pattern("Circle");
    var star = new Pattern("Star");

    this.patterns.push(rect);
    this.patterns.push(door);
    this.patterns.push(stairway);
    this.patterns.push(stripes);
    this.patterns.push(circle);
  }
}
