class Command {
  redo(){
        throw new Error("Abstract method!");
  }
  undo(){
        throw new Error("Abstract method!");
  }
}

class History {
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

  doCommand(command){
    if(command instanceof nCommand){
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
