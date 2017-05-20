class Command {
    constructor() {
        throw new Error("Can't instantiate abstract class!");
    }

    execute() {
        throw new Error("Abstract method!");
    }

    undo() {
        throw new Error("Abstract method!");
    }
}

class PencilClickCommand extends Command{
    constructor(map, x, y, prevColor, newColor) {
        this.map = map
        this.x = x
        this.y = y
        this.prevColor = prevColor
        this.newColor = newColor
    }
    execute() {
        this.map.changeFillStyle(this.x, this.y, this.newColor, true)
    }

    undo() {
        this.map.changeFillStyle(this.x, this.y, this.prevColor, true)
    }
}