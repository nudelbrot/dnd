export class Colorpicker{
  constructor(id, initialColor = "#000000"){
    this.color = initialColor;
    this.ui = $('<button id="' + id + '" class="btn btn-default">' +
      '<span class="material-icons">lens</span>' +
      '</button>');
    this.ui.on("click", () => this.ui.colorpicker("show"));
    this.ui.colorpicker({ "color": this.color, "colorSelectors": Colorpicker.DEFAULT_COLORS }).on("changeColor", () => {
      var color = this.ui.colorpicker("getValue");
      this.ui.find("span").css("color", color);
      this.color = color;
      $(this).trigger("changeColor", color);
    });
  }

  static get DEFAULT_COLORS() {
    return {
      '#000000': '#000000',
      '#ffffff': '#ffffff',
      '#FF0000': '#FF0000',
      '#777777': '#777777',
      '#337ab7': '#337ab7',
      '#5cb85c': '#5cb85c',
      '#5bc0de': '#5bc0de',
      '#f0ad4e': '#f0ad4e',
      '#d9534f': '#d9534f'
    };
  }
}

//addColorpickers() {
//  this.backgroundColorPicker = $('<button id="bgCp" class="btn btn-default">' +
//      '<span class="material-icons">lens</span>' +
//      '</button>');
//  this.backgroundColorPicker.on("click", function () { t.backgroundColorPicker.colorpicker("show"); });
//  this.backgroundColorPicker.colorpicker({ "color": this.backgroundColor, "colorSelectors": defaultColors }).on("changeColor", function (e) {
//      var color = t.backgroundColorPicker.colorpicker("getValue");
//      t.backgroundColorPicker.find("span").css("color", color);
//      t.backgroundColor = color;
//      t.pencil.backgroundColor = color;
//      t.bucket.backgroundColor = color;
//      t.path.backgroundColor = color;
//      });
//  var btnGrp = $("<div class='btn-group'></div>");
//  btnGrp.append(this.foregroundColorPicker);
//  btnGrp.append(this.backgroundColorPicker);
//  this.form.append(btnGrp);
//}
