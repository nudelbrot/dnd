import {Tool} from "./Tool.class";
import {Colorpicker} from "./Colorpickers.class";
import {RectMap} from "../map/map.class";

export class Toolbar {
  constructor(target, map) {
    this.map = map;
    this.tools = [];
    this.setupUI();
    this.setupEvents();
    this.customCursor = false;
    target.append(this.panel[0]);
  }

  setupUI(){
    this.panel = $('<div id="tb_panel" class="text-center"></div>');
    this.form = $("<div></div>", { "class": "navbar-form form-group" });
    this.panel.append(this.form[0]);
    this.setupColorpicker();
    this.setupTools();
    this.addUndoRedoButtons();
    this.addPixelSizeSlider();
    this.form.children().css('padding-right', '10px');
  }

  setupEvents(){
    $(this.map.canvas).bind('contextmenu', (e) => { this.onClick(e); return false;});
    this.map.on("click", (evt) => { this.onClick(evt); });
    this.map.on("mouseup", (evt) => { this.onMouseUp(evt); });
    this.map.on("mousedown", (evt) => { this.onMouseDown(evt); });
    this.map.on("mousemove", (evt) => { this.onMouseMove(evt); });
    this.map.on("touchend", (evt) => {evt.which=1; this.onMouseUp(evt); });
    this.map.on("touchstart", (evt) => {evt.which=1; this.onMouseDown(evt); });
    this.map.on("touchmove", (evt) => {evt.which=1; console.debug(evt); this.onMouseMove(evt); });
  }

  setupColorpicker(){
    this.foregroundColorPicker = new Colorpicker("fgCp");
    this.backgroundColorPicker = new Colorpicker("bgCp");
    var btnGrp = $("<div class='btn-group'></div>");
    btnGrp.append(this.foregroundColorPicker.ui);
    btnGrp.append(this.backgroundColorPicker.ui);
    this.form.append(btnGrp);          
    this.backgroundColorPicker.ui.colorpicker("setValue", this.map.fillStyle);
  }

  setupTools() {
    var grp = $('<div id="toolBtnGroup" class="btn-group" role="group"></div>');
    Tool.tools.sort( function (a, b){ return b.index < a.index;});
    Tool.tools.forEach((tool) =>{
      var newTool = new tool(this);
      grp.append(newTool.button);
      newTool.button.on("click", () => this.setActiveTool(newTool));
      $(this.foregroundColorPicker).on("changeColor", (e, color) => newTool.foregroundColor = color);
      $(this.backgroundColorPicker).on("changeColor", (e, color) => newTool.backgroundColor = color);
      this.tools.push(new tool(this));
    });
    this.form.prepend(grp);

    if(this.tools.length > 0){
      this.activeTool = this.tools[0];
      this.setActiveTool(this.tools[0]);
    }

  }

  addUndoRedoButtons() {
    this.buttonUndo = $('<button id="UndoButton" type="button" class="btn  btn-default disabled"> <span class="material-icons">' + "undo" + '</span></button>');
    this.buttonRedo = $('<button id="RedoButton" type="button" class="btn  btn-default disabled"> <span class="material-icons">' + "redo" + '</span></button>');
    this.buttonUndo.on("click", () => { this.map.backward(); this.checkUndoAndRedoButton(); });
    this.buttonRedo.on("click", () => { this.map.forward(); this.checkUndoAndRedoButton(); });
    var btnGrp = $("<div class='btn-group'></div>");
    btnGrp.append(this.buttonUndo);
    btnGrp.append(this.buttonRedo);
    this.form.prepend(btnGrp);
  }

  checkUndoAndRedoButton() {
    if (this.map.undoable()) {
      this.buttonUndo.removeClass("disabled");
    } else {
      this.buttonUndo.addClass("disabled");
    }
    if (this.map.redoable()) {
      this.buttonRedo.removeClass("disabled");
    } else {
      this.buttonRedo.addClass("disabled");
    }
  }

  addPixelSizeSlider(){
    this.slider = $('<div id="slider"></div>');
    this.slider.css({ "width": "100px", "display": "inline-block", "padding-left": "10px" });
    this.slider.slider({ range: "min", value: 32, min: 8, max: 56 });
    this.slider.on("slide", (event, ui) => this.map.changeCellSize(ui.value));
    this.form.append(this.slider);
  }

  setActiveTool(tool) {
    this.activeTool.panel.detach();
    this.activeTool = tool;
    this.panel.find(".btn").removeClass("btn-primary");
    tool.button.addClass("btn-primary");
    this.panel.find(".panel-body").append(this.activeTool.panel);
    if (this.customCursor) {
      this.activeTool.enableCursor();
    } else {
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
