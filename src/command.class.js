class SculptureCommand extends Command {
    constructor(sculptureTool, listOfCoords, newColor) {
        super();
        this.sculptureTool = sculptureTool;
        this.map = sculptureTool.map;
        this.listOfCoords = listOfCoords;
        this.newColor = newColor;
        //console.debug(this)
    }
    redo() {
        var t = this;
        this.listOfCoords.forEach(function (coord) {
            t.sculptureTool.changeCellFillstyle(coord.x, coord.y, t.newColor, false);
        });
        this.map.render();
        this.map.historyIndex++;
    }

    undo() {
        var t = this;
        this.listOfCoords.forEach(function (coord) {
            t.sculptureTool.changeCellFillstyle(coord.x, coord.y, coord.oldC, false);
        });
        this.map.render();
        this.map.historyIndex--;
    }
}

class ChangeBackgroundCommand extends Command {
    constructor(map, oldMapColor, newMapColor) {
        super();
        this.map = map;
        this.oldMapColor = oldMapColor;
        this.newMapColor = newMapColor;
    }
    redo() {
        this.map.fillStyle = this.newMapColor;
        this.map.render();
        this.map.historyIndex++;
    }
    undo() {
        this.map.fillStyle = this.oldMapColor;
        this.map.render();
        this.map.historyIndex--;
    }
}
