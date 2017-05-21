class Command {
    constructor() {
        //throw new Error("Can't instantiate abstract class!");
    }

    redo() {
        throw new Error("Abstract method!");
    }

    undo() {
        throw new Error("Abstract method!");
    }
}

class SculptureCommand extends Command {
    constructor(sculptureTool, listOfCoords, newColor) {
        super()
        this.sculptureTool = sculptureTool
        this.map = sculptureTool.map
        this.listOfCoords = listOfCoords
        this.newColor = newColor
        //console.debug(this)
    }
    redo() {
        var t = this;
        this.listOfCoords.forEach(function (coord) {
            t.sculptureTool.changeCellFillstyle(coord.x, coord.y, t.newColor, false)
        })
        this.map.render();
        this.map.historyIndex++;
    }

    undo() {
        var t = this;
        this.listOfCoords.forEach(function (coord) {
            t.sculptureTool.changeCellFillstyle(coord.x, coord.y, coord.oldC, false)
        })
        this.map.render();
        this.map.historyIndex--;
    }
}