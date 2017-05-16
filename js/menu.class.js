class MenuItem {
  constructor(parent){
    this.parent = parent;
  }
}

class Menu extends MenuItem {
  constructor(parent){
    this.entries = [];
    super(parent);
  }
  addEntry(entry){
    this.entries.push(entry);
  }

}

class DropDownMenu extends Menu {
  construct(parent, text){
    super(parent);
    this.menu = $('<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">' + text + '<span class="caret"></span></a>');
    this.container = $('<ul class="dropdown-menu"></ul>');
    this.menu.append(container);
  }
  addEntry(text){
    var entry = new DropDownMenuItem(this, text);
    this.container.append(entry.container);
    super.addEntry(entry);
  }
}

class DropDownMenuItem extends MenuItem {
  construct(parent, text, href="#"){
    super(parent);
    this.container = $('<li href="' + href + '">' + text + '</a></li>');
  }
}

class MenuBar extends Menu {
  constructor(){
    super();
    this.target = $("body");
    this.navbar = $("<nav></nav>");
    this.navbar.addClass("navbar navbar-default");
    this.navContainer = $("<div></div>");
    this.navContainer.addClass("container-fluid");
    var navHeader = $("<div></div>");
    navHeader.addClass("navbar-header");
    var burgerButton = $('<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false"> <span class="sr-only">Toggle navigation</span> <span class="icon-bar"></span> <span class="icon-bar"></span> <span class="icon-bar"></span> </button>');
    var logo = $("<a href='#'>DnD</a>");
    logo.addClass("navbar-brand");
    var exportInport = new DropDownMenu(this, "Export/Inport");
    this.addEntry(exportInport);

    navHeader.append(burgerButton, logo);
    this.navContainer.append(navHeader);
    this.navbar.append(this.navContainer);
    this.target.prepend(this.navbar);
  }


  

}
