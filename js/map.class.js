class Cell {
    constructor(map, x, y, z){
        this.map = map;
        this.x = x;
        this.y = y;
        this.z = z;
        this.fillStyle = this.map.fillStyle;
        this.strokeStyle = "#ffffff";
        this.lineWidth = 1;
        this.highlight = false;
        this.highlightStyle = "#ff0000"
    }
    render(ctx, stroke=true, cellWidth=this.map.cellWidth, cellHeight=this.map.cellHeight){
        if(!ctx){
            ctx = this.map.canvas.getContext("2d");
        }
        ctx.lineWidth = this.lineWidth;
        ctx.globalCompositeOperation = "source-over";
        if(this.highlight){
            ctx.fillStyle = this.highlightStyle;
        } else {
            ctx.fillStyle = this.map.gridColor;
        }
        ctx.fillRect(this.x * cellWidth, this.y * cellHeight, cellWidth + 1, cellHeight + 1);
        ctx.fillStyle = this.fillStyle;
        ctx.strokeStyle = this.strokeStyle;
        ctx.fillRect(this.x * cellWidth + 1, this.y * cellHeight + 1, cellWidth - 1, cellHeight - 1);
        if(stroke){
            ctx.stroke();
        }
    }
    }

    class RectMap {
        constructor(target, cellWidth=32, cellHeight=32) {
            this.canvas = $("<canvas></canvas>")[0];
            var t = this;
            $("html").css("overflow", "hidden");
            this.width = function(){return Math.ceil($(target).width()/t.cellWidth);}
            this.height = function(){return Math.ceil(($(window).height()-$(target).offset().top)/t.cellHeight);}

            var ctx = this.canvas.getContext("2d");
            this.cellWidth = cellWidth;
            this.cellHeight = cellHeight;
            this.translation = {x: 0, y: 0, X: function(){return t.translation.x * t.cellWidth}, Y: function(){return t.translation.y * t.cellHeight}};
            this.scaleLevel = 1.0;
            this.gridColor = "#dddddd";
            this.fillStyle = "#fbfbfb";

            this.history = [];
            this.historyIndex = -1;
            this.data = [];
            this.panel = $("<div></div>");
            this.panel.append(this.canvas);
            target.append(this.panel[0]);
            this.render();
        }

        changeCellSize(newSize){
            var oldTranslation = {x: this.translation.x, y: this.translation.y};
            this.translate(-oldTranslation.x, -oldTranslation.y)
            var trans = {x: this.width(), y: this.height()};
            this.cellWidth = newSize;
            this.cellHeight = newSize;
            trans.x = Math.floor((trans.x - this.width())/2);
            trans.y = Math.floor((trans.y - this.height())/2);
            this.translate(oldTranslation.x - trans.x, oldTranslation.y - trans.y);
            $(this).trigger("resize", newSize);
        }

        newCommand(command, toolbar){
            if (this.history.length > 0){
                this.history = this.history.slice(0, this.historyIndex+1)
            }
            this.history.push(command)
            this.historyIndex++;
            toolbar.checkUndoAndRedoButton()
        }

        getCell(x, y, z=0) {
            if(z >= 0){
                if(this.data[z]){
                    if(this.data[z][x]){
                        if(!this.data[z][x][y]){
                            this.data[z][x][y] = new Cell(this, x, y, z);
                        }
                    }else{
                        this.data[z][x] = [];
                        this.data[z][x][y] = new Cell(this, x, y, z);
                    }
                }else{
                    this.data[z] = [];
                    this.data[z][x] = [];
                    this.data[z][x][y] = new Cell(this, x, y, z);
                }
            }else {
                if(this.data[z]){
                    if(this.data[z][x]){
                        if(!this.data[z][x][y]){
                            this.data[z][x][y] = "";
                        }
                    }else{
                        this.data[z][x] = [];
                        this.data[z][x][y] = "";
                    }
                }else{
                    this.data[z] = [];
                    this.data[z][x] = [];
                    this.data[z][x][y] = "";
                }
            }
            return this.data[z][x][y];
        }
        getCurrentCells(z = 0){//TODO: RENAME... MORE LOOPS
            var ret = [];
            if(this.data[z]){
              for(var row in this.data[z]){
                if(!(this.data[z][row] instanceof Function)){
                  for(var col in this.data[z][row]){
                    if(!(this.data[z][row][col] instanceof Function)){
                      ret.push(this.data[z][row][col]);
                    }
                  }
                }
              }
            }
            return ret;
        }

        isCell(x, y, z = 0) {
            return (this.data[z] && this.data[z][x] && this.data[z][x][y]);
        }

        removeCell(x, y, z = 0) {
            var ctx = this.canvas.getContext("2d");
            //ctx.clearRect(x * this.cellWidth, y * this.cellHeight, this.cellWidth + 1, this.cellHeight + 1)
            if(this.data[z] && this.data[z][x] && this.data[z][x][y]){
                this.data[z][x][y] = undefined;
                delete this.data[z][x][y];
            }
        }

        getFillstyle(x,y){
            if(this.isCell(x,y)){
                return this.getCell(x,y).fillStyle;
            } else {
                return this.fillStyle;
            }
        }

        changeCellFillstyle(x, y, fillStyle, render, z=0){
            var cell = this.getCell(x, y, z);
            cell.fillStyle = fillStyle;
            if (render){
                cell.render()
                if(this.onRenderFunction){
                    this.onRenderFunction();
                }
            }
            return true;
        }

        scale(mode){
        }

        render(ctx){
            if(!ctx){
                ctx = this.canvas.getContext("2d");
            }
            if(Math.abs(this.width() * this.cellWidth - this.canvas.width) > this.cellWidth || Math.abs(this.height() * this.cellHeight -this.canvas.height) > this.cellHeight){
                this.canvas.width = this.width() * this.cellWidth; 
                this.canvas.height = this.height() * this.cellHeight; 
                ctx.canvas.width = this.width() * this.cellWidth; 
                ctx.canvas.height = this.height() * this.cellHeight; 
                this.canvas.getContext("2d").translate(this.translation.X(), this.translation.Y());//TODO
            }

            ctx.globalCompositeOperation = "copy";
            ctx.fillRect(0,0,0,0);
            ctx.stroke();

            ctx.globalCompositeOperation = "source-over";
            ctx.fillStyle = this.gridColor;
            ctx.fillRect(-this.translation.X(), -this.translation.Y(), this.width() * this.cellWidth, this.height() * this.cellHeight);
            ctx.stroke();
            ctx.moveTo(0,0);
            ctx.globalCompositeOperation = "source-over";
            var height = this.height();
            var width = this.width();
            var Z = Math.max(this.data.length, 1);
            for(var i = 0; i < height; ++i){
                for(var j = 0; j < width; ++j){
                    var x = j - this.translation.x;
                    var y =  i - this.translation.y;
                    ctx.fillStyle = this.fillStyle;
                    ctx.fillRect(x * this.cellWidth + 1, y * this.cellHeight + 1, this.cellWidth - 1, this.cellHeight - 1);
                    for(var z = 0; z < Z; ++z){
                        if(this.isCell(x, y, z)){
                            this.data[z][x][y].render(ctx, false);
                        }
                    }
                    if(this.data[-1] && this.data[-1][x] && this.data[-1][x][y]){
                      ctx.fillStyle = this.data[-1][x][y];
                      ctx.fillRect(x * this.cellWidth + 1, y * this.cellHeight + 1, this.cellWidth - 1, this.cellHeight - 1);
                    }
                }
            }
            ctx.stroke();
            if(this.onRenderFunction){
                this.onRenderFunction();
            }
        }

  

        toJson(){
            var toExport = {fs: this.fillStyle, data: []}
            var currentCells = this.getCurrentCells();
            currentCells.forEach(function(cell){
                toExport.data.push({x: cell.x, y: cell.y, fs: cell.fillStyle});
            });
    
            var url = 'data:text/json;charset=utf8,' + encodeURIComponent(JSON.stringify(toExport));
            var anchor = $("#saveJSON")[0];
            anchor.setAttribute("href", url)
            anchor.setAttribute("download", "map.json")

        }

        fromJson(json){
            this.fillStyle = json.fs;
            for(var c in json.data){
                var cell = json.data[c];
                this.getCell(cell.x, cell.y).fillStyle = cell.fs;
            }
            this.render();
        }

        toPNG(minX = -Number.MAX_VALUE, minY = -Number.MAX_VALUE, maxX = Number.MAX_VALUE, maxY = Number.MAX_VALUE){
            var canvas = $("<canvas></canvas>");
            var ctx = canvas[0].getContext("2d");
            var viewport = {minX: Number.MAX_VALUE, minY: Number.MAX_VALUE, maxX: -Number.MAX_VALUE, maxY: -Number.MAX_VALUE }

            var currentCells = this.getCurrentCells();
            currentCells.forEach(function(cell){
                viewport.minX = Math.min(viewport.minX, cell.x);
                viewport.maxX = Math.max(viewport.maxX, cell.x);
                viewport.minY = Math.min(viewport.minY, cell.y);
                viewport.maxY = Math.max(viewport.maxY, cell.y);
            }
            );
            var ppi = 72;
            ctx.canvas.width = (viewport.maxX - viewport.minX + 1)*ppi;
            ctx.canvas.height = (viewport.maxY - viewport.minY + 1)*ppi;
            ctx.translate(-viewport.minX * ppi, -viewport.minY * ppi);
            currentCells.forEach(function(cell){
                if(cell.x <= maxX && cell.x >= minX && cell.y <= maxY && cell.y >= minY){
                    cell.render(ctx, false, ppi, ppi);
                }
            });
            ctx.stroke();
            var url = canvas[0].toDataURL("image/png");
            var anchor = $("#exportPNG")[0];
            anchor.setAttribute("href", url)
            //a.setAttribute("target", "_blank")
            anchor.setAttribute("download", "map.png")

        }

        on(trigger, action){
            if(trigger == "render"){
                this.onRenderFunction = action;
            }else{
                $(this.canvas).on(trigger, action);
            }
        }

        translate(x, y, render = true){
            this.translation.x = this.translation.x + x;
            this.translation.y = this.translation.y + y;
            this.canvas.getContext("2d").translate(x * this.cellWidth, y * this.cellHeight);
            this.render();
        }

    }
