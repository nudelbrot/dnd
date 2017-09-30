export class Colorpicker{
  constructor(id, initialColor){
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

  setColor(color){
    this.ui.colorpicker("setValue", color);
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
