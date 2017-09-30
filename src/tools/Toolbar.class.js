import {PathTool} from "./sculpture/PathTool.class";
import {BucketTool} from "./sculpture/BucketTool.class";
import {PencilTool} from "./sculpture/PencilTool.class";
import {Colorpicker} from "./Colorpickers.class";

export class Toolbar {
  constructor(target, map) {
    this.map = map;
    this.panel = $('<div id="tb_panel" class="text-center"></div>');
    this.form = $("<div></div>", { "class": "navbar-form form-group" });
    this.panel.append(this.form[0]);
    this.foregroundColor = "#000000";
    this.backgroundColor = "#ffffff";
    this.setupColorpicker();
    this.addTools();
    this.addUndoRedoButtons();
    this.addPixelSizeSlider();
    this.form.children().css('padding-right', '10px');
    this.customCursor = false;
    //TODO this.backgroundColorPicker.colorpicker("setValue", this.map.fillStyle);
    target.append(this.panel[0]);
    var t = this;
    $(this.map.canvas).bind('contextmenu', function (e) {
      t.onClick(e);
      return false;
    });

    this.map.on("click", function (evt) { t.onClick(evt); });
    this.map.on("mouseup", function (evt) { t.onMouseUp(evt); });
    this.map.on("mousedown", function (evt) { t.onMouseDown(evt); });
    this.map.on("mousemove", function (evt) { t.onMouseMove(evt); });
    this.map.on("touchend", function (evt) {evt.which=1; t.onMouseUp(evt); });
    this.map.on("touchstart", function (evt) {evt.which=1; t.onMouseDown(evt); });
    this.map.on("touchmove", function (evt) {evt.which=1; console.debug(evt); t.onMouseMove(evt); });
  }

  setupColorpicker(){
    this.foregroundColorPicker = new Colorpicker("fgCp", "#000000");
    this.backgroundColorPicker = new Colorpicker("bgCp", this.map.fillStyle);
    var btnGrp = $("<div class='btn-group'></div>");
    btnGrp.append(this.foregroundColorPicker.ui);
    btnGrp.append(this.backgroundColorPicker.ui);
    this.form.append(btnGrp);          
  }

  addTools() {
    //this.rectSelector = new RectSelectionTool(this);
    //this.magicStick = new MagicStickTool(this);
    this.pencil = new PencilTool(this, this.foregroundColorPicker, this.backgroundColorPicker);
    this.bucket = new BucketTool(this, this.foregroundColorPicker, this.backgroundColorPicker);
    this.path = new PathTool(this, this.foregroundColorPicker, this.backgroundColorPicker);

    var grp = $('<div class="btn-group" role="group"></div>');

    //grp.append(this.rectSelector.button);
    //grp.append(this.magicStick.button);
    grp.append(this.pencil.button);
    grp.append(this.path.button);
    grp.append(this.bucket.button);
    var t = this;

    this.path.button.on("click", function () {
      t.setActiveTool(t.path);
    });
    //this.rectSelector.button.on("click", function () {
    //  t.setActiveTool(t.rectSelector);
    //});
    //this.magicStick.button.on("click", function () {
    //  t.setActiveTool(t.magicStick);
    //});
    this.pencil.button.on("click", function () {
      t.setActiveTool(t.pencil);
    });
    this.bucket.button.on("click", function () {
      t.setActiveTool(t.bucket);
    });

    this.activeTool = this.pencil;
    this.setActiveTool(this.pencil);
    //form.append(grp);
    this.form.prepend(grp);

  }

  addUndoRedoButtons() {
    this.buttonUndo = $('<button id="UndoButton" type="button" class="btn  btn-default disabled"> <span class="material-icons">' + "undo" + '</span></button>');
    this.buttonRedo = $('<button id="RedoButton" type="button" class="btn  btn-default disabled"> <span class="material-icons">' + "redo" + '</span></button>');

    var t = this;
    this.buttonUndo.on("click", function () {
      t.map.backward();
      t.checkUndoAndRedoButton();
    });

    this.buttonRedo.on("click", function () {
      t.map.forward();
      t.checkUndoAndRedoButton();
    });
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
    this.slider.css("width", "100px");
    this.slider.css("display", "inline-block");
    this.slider.css("padding-left", "10px");
    this.slider.slider({
      range: "min",
      value: 32,
      min: 8,
      max: 56,
    });
    var t = this;
    this.slider.on("slide", function(event, ui){
      t.map.changeCellSize(ui.value);
    });
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
