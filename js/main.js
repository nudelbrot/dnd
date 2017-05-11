//import {Map} from "map.class.js";
//import {Navigation} from "navigation.class.js";
//import {Tool} from "tool.class.js;

class Dnd{
  constructor(target){
    this.target = target;
    this.loaded = {map: false, navigation: false, toolbar: false};
    var t = this;
    $.getScript("js/map.class.js", function(){t.gotScript("map");});
    $.getScript("js/navigation.class.js", function(){t.gotScript("navi");});
    $.getScript("js/tool.class.js", function(){t.gotScript("tools");});
  }
  finishedLoading(){
      this.map = new RectMap(target, 32, 32, 24, 24);
      this.navigation = new Navigation(target, this.map);
      var toolbar = new Toolbar(target, this.map);
      
  }
  gotScript(lib){
    if(lib == "map"){
      this.loaded.map = true;
    }else if(lib == "navi"){
      this.loaded.navigation = true;
    }else if(lib == "tools"){
      this.loaded.toolbar = true;
    }
    if(this.loaded.map && this.loaded.navigation && this.loaded.toolbar){
      this.finishedLoading();
    }
  }
}
