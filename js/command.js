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

class BucketCommand {

}