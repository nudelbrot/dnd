export class Command {
  redo(){
        throw new Error("Abstract method!");
  }
  undo(){
        throw new Error("Abstract method!");
  }
}

export class History {
  constructor(){
    this.stack = [];
    this.pointer = 0;
  }

  forward(){
    if(this.pointer < this.stack.length){
      this.stack[this.pointer].redo();
      this.pointer++;
    }
  }

  backward(){
    if(this.pointer > 0){
      this.pointer--;
      this.stack[this.pointer].undo();
    }
  }

  undoable(){
    return this.pointer > 0;
  }

  redoable(){
    return this.pointer < this.stack.length;
  }

  doCommand(command){
    if(command instanceof Command){
      if(this.pointer < this.stack.length){
        this.stack.splice(this.pointer, this.stack.length);
      }
      this.stack.push(command);
      this.pointer++;
      command.redo();
    } else {
      throw new Error("given command not inherits from Command");
    }
  }
}
