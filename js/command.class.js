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

class PencilCommand extends Command {
    constructor(pencilTool, listOfCoords, prevColor, newColor) {
        super()
        this.pencilTool = pencilTool
        this.map = pencilTool.map
        this.listOfCoords = listOfCoords
        this.prevColor = prevColor
        this.newColor = newColor
        //console.debug(this)
    }
    redo() {
        var t = this;
        this.listOfCoords.forEach(function (coord) {
            t.pencilTool.changeCellFillstyle(coord[0], coord[1], t.newColor, false)
        })
        this.map.render();
        this.map.historyIndex++;
    }

    undo() {
        var t = this;
        this.listOfCoords.forEach(function (coord) {
            t.pencilTool.changeCellFillstyle(coord[0], coord[1], t.prevColor, false)
        })
        this.map.render();
        this.map.historyIndex--;
    }
}