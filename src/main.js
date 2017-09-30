import {RectMap} from "./map/map.class";
import {Navigation} from "./map/navigation.class";
import {Toolbar} from "./tools/Toolbar.class";

class Dnd {
  constructor(target) {
    this.target = target;

    this.prepArrayEqualsAndContains();
    this.map = new RectMap(target);
    this.toolbar = new Toolbar($(".collapse"), this.map);
    this.navigation = new Navigation(target, this.map);

    var t = this;
    $(window).resize(function (e) {
      t.map.render();
      t.navigation.onResize(e);
    });
    $("#saveJSON").on("click", function (a, b) { t.map.toJson(a, b); });
    $("#exportPNG").on("click", function (a, b) { t.map.toPNG(); });
    $("#loadJSON").on("click", function (a, b) {
      var finput;
      if (window.File && window.FileReader && window.FileList && window.Blob) {
        finput = $('<input type="file" name="files" title="Load JSON" />');
        finput.on("change", function (a, b) {
          var f, reader;
          f = a.target.files[0];
          if (f.type.match('application/json') || true) {
            reader = new FileReader();
            reader.onload = function (file) {
              var json, parsed;
              json = file.target.result;
              try {
                parsed = JSON.parse(json);
                t.map.fromJson(parsed);
              } catch (error) {
                alert("parsing error: " + error);
              }
            };
            return reader.readAsText(f);
          } else {
            alert("a JSON file is required");
          }
        });
        return finput.click();
      } else {
        alert('The File APIs are not fully supported in this browser.');
      }
    });
  }

  prepArrayEqualsAndContains() {
    Array.prototype.equals = function (array) {
      // if the other array is a falsy value, return
      if (!array)
        return false;

      // compare lengths - can save a lot of time 
      if (this.length != array.length)
        return false;

      for (var i = 0, l = this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
          // recurse into the nested arrays
          if (!this[i].equals(array[i]))
            return false;
        }
        else if (this[i] != array[i]) {
          // Warning - two different object instances will never be equal: {x:20} != {x:20}
          return false;
        }
      }
      return true;
    };

    if (Array.prototype.contains)
      console.warn("Overriding existing Array.prototype.contains. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
    // attach the .contains method to Array's prototype to call it on any array
    Array.prototype.contains = function (thing) {
      // if the other array is a falsy value, return false
      if (!this)
        return false;

      //start by assuming the array doesn't contain the thing
      var result = false;
      for (var i = 0, l = this.length; i < l; i++) {
        //if anything in the array is the thing then change our mind from before

        if (this[i] instanceof Array) {
          if (this[i].equals(thing))
            result = true;
        }
        else
          if (this[i] === thing)
            result = true;


      }
      //return the decision we left in the variable, result
      return result;
    };
  }
}
$(()=> new Dnd($("#target")));
