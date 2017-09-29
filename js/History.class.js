class nCommand {
  act(){}
  revert(){}
}

class History {
  constructor(){
    this.stack = [];
    this.pointer = 0;
  }

  forward(){
    if(this.pointer < this.stack.length){
      this.stack[this.pointer].act();
      this.pointer++;
    }
  }

  backward(){
    if(this.pointer > 0){
      this.pointer--;
      this.stack[this.pointer].revert();
    }
  }

  doCommand(command){
    if(command instanceof nCommand){
      if(this.pointer < this.stack.length){
        this.stack.splice(this.pointer, this.stack.length)
      }
      this.stack.push(command);
      this.pointer++;
      command.act();
    } else {
      throw new Error("given command not inherits nCommand");
    }
  }
}
