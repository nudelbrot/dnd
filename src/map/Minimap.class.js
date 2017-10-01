export class Minimap{
  constructor(target, map, navigation){
    this.target = target;
    this.map = map;
    this.navigation = navigation;
    this.factor = {viewport: 20.0, canvas: 10.0};
    this.translation = {x: 0, y: 0};
    this.setupUI();
    this.viewport = {width: target.width()/this.factor.viewport, height: target.height()/this.factor.viewport};
    this.map.on("render", () => this.render());
    this.render();
  }

  setupUI(){
    var width = this.target.width / this.factor.canvas;
    var height = this.target.height / this.factor.canvas;
    this.canvas = $("<canvas id='minimap'></canvas>");
    this.canvas.css({
      "width": width+"px",
      "height": height+"px",
      "position": "absolute",
      "float": "right",
      "bottom": "0px",
      "right": "0px",
      "background": "#eeeeee"
    });
    this.target.append(this.canvas);
  }

  render(){
    var ctx = this.canvas[0].getContext("2d");
    var scale = {width: this.map.cellWidth / this.factor.viewport, height: this.map.cellHeight / this.factor.viewport};
    ctx.globalCompositeOperation = "copy";
    ctx.rect(0,0,0,0);
    ctx.stroke();
    ctx.globalCompositeOperation = "source-over";
    var p = {x: this.canvas.width()/2 - this.viewport.width/2, y: this.canvas.height()/2  - this.viewport.height/2};
    ctx.fillStyle = "#cccccc";
    ctx.fillRect(p.x - this.translation.x*scale.width, p.y - this.translation.y*scale.height, this.viewport.width, this.viewport.height);
    ctx.stroke();
    var currentCells = this.map.getCurrentCells();
    currentCells.forEach((cell) => {
      ctx.fillStyle = cell.fillStyle;
      ctx.fillRect(p.x + cell.x * scale.width, p.y + cell.y * scale.height, scale.width, scale.height);
    });
    ctx.stroke();
  }

  translate(x, y){
    this.canvas[0].getContext("2d").translate(x, y);
    this.translation.x += x;
    this.translation.y += y;
  }
}

