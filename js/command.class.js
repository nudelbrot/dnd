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

class PencilClickCommand extends Command {
    constructor(map, x, y, prevColor, newColor) {
        super()
        this.map = map
        this.x = x
        this.y = y
        this.prevColor = prevColor
        this.newColor = newColor
    }
    redo() {
        this.map.changeCellFillstyle(this.x, this.y, this.newColor, true)
        this.map.historyIndex++;
        console.debug(this.map.historyIndex)
    }

    undo() {
        this.map.changeCellFillstyle(this.x, this.y, this.prevColor, true)
        this.map.historyIndex--;
        console.debug(this.map.historyIndex)
    }
}