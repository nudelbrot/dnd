//import {Map} from "map.class.js";
//import {Navigation} from "navigation.class.js";
//import {Tool} from "tool.class.js;

class Dnd{
  constructor(target){
    this.target = target;
    this.loaded = {map: false, navigation: false, toolbar: false, menu: false};
    var t = this;
    $.getScript("js/menu.class.js", function(){t.gotScript("menu");});
    $.getScript("js/map.class.js", function(){t.gotScript("map");});
    $.getScript("js/navigation.class.js", function(){t.gotScript("navi");});
    $.getScript("js/tool.class.js", function(){t.gotScript("tools");});
  }
  finishedLoading() {
      this.prepArrayEqualsAndContains();
      this.menubar = new MenuBar($("body"));
      this.map = new RectMap(target, 32, 32, 24, 24);
      this.toolbar = new Toolbar(target, this.map);
      this.navigation = new Navigation(target, this.map);
     
  }
  gotScript(lib){
    if(lib == "map"){
      this.loaded.map = true;
    }else if(lib == "navi"){
      this.loaded.navigation = true;
    }else if(lib == "tools"){
      this.loaded.toolbar = true;
    }else if(lib == "menu"){
      this.loaded.menu = true;
    }
    if(this.loaded.map && this.loaded.navigation && this.loaded.toolbar && this.loaded.menu){
      this.finishedLoading();
    }
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
      }

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
      }
  }
}
