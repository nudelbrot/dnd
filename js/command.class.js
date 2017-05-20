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
    constructor(pencilTool, x, y, prevColor, newColor) {
        super()
        this.pencilTool = pencilTool
        this.map = pencilTool.map
        this.x = x
        this.y = y
        this.prevColor = prevColor
        this.newColor = newColor
        console.debug("prev " + this.prevColor + " new " + this.newColor)
    }
    redo() {
        this.pencilTool.changeCellFillstyle(this.x, this.y, this.newColor, true)
        console.debug("prev " + this.prevColor + " new " + this.newColor)
        this.map.historyIndex++;
        console.debug(this.map.historyIndex)
    }

    undo() {
        this.pencilTool.changeCellFillstyle(this.x, this.y, this.prevColor, true)
        console.debug("prev " + this.prevColor + " new " + this.newColor)
        this.map.historyIndex--;
        console.debug(this.map.historyIndex)
    }
}