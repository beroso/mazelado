
function Element(line,column){
    this.line = line;
    this.column = column;
    
    this[line-1] = [];
    this[line] = [];
    this[line+1] = [];
    
    this[line-1][column] = false;
    this[line+1][column] = false;
    this[line][column+1] = false;
    this[line][column-1] = false;
}

Element.prototype.getLeft = function () {
    return this[this.line][this.column-1];
}

Element.prototype.getRight = function () {
    return this[this.line][this.column+1];
}

Element.prototype.getNorth = function () {
    return this[this.line-1][this.column];
}

Element.prototype.getSouth = function () {
    return this[this.line+1][this.column];
}

Element.prototype.indexOfLeft = function() {
    return [this.line,this.column-1]    
}

Element.prototype.indexOfRight = function() {
    return [this.line,this.column+1]    
}

Element.prototype.indexOfNorth = function() {
    return [this.line-1,this.column]    
}

Element.prototype.indexOfSouth = function() {
    return [this.line+1,this.column]    
}

Element.prototype.changeValue = function(line,column) {
    this[line][column] = !this[line][column];    
}

Element.prototype.isZero = function () {
     return !this.getLeft() && !this.getRight() && !this.getNorth() && !this.getSouth();
}

function Cell(canvas,x,y) {
    this.x = x;
    this.y = y;
    this.canvas = canvas;
    this.backtrack = new Element(x,y);
    this.solution = new Element(x,y);
    this.border = new Element(x,y);
    this.wall = new Element(x,y);
}

Cell.prototype.draw = function() {
    this.canvas.strokeRect(this.x*this.canvas.space, this.y*this.canvas.space, this.canvas.space, this.canvas.space);
}

Cell.prototype.drawBreakWall = function(xi, yi, xf, yf, color) {

    var canvas = this.canvas;
    this.canvas.timeout += 10;

    
    setTimeout(
      function() {
        canvas.strokeStyle = color;
        canvas.drawLine(xi, yi, xf, yf);
        canvas.strokeStyle = '#000000';
      },
      this.canvas.timeout
    );
}

Cell.prototype.wallIsIntact = function () {
    return this.wall.isZero();
}

Cell.prototype.breakWall = function(line,column) {
    this.wall.changeValue(line,column);
    
    var y = this.x * this.canvas.space;
    var x = this.y * this.canvas.space;
   
    
    if(this.wall.getLeft()) {  
        this.drawBreakWall(x, y + 1, x, y + this.canvas.space - 1, '#ffffff');
    }
    
    if(this.wall.getRight()) {
        this.drawBreakWall(x + this.canvas.space, y + 1, x + this.canvas.space, y - 1 + this.canvas.space, '#ffffff');
    }
    
    if(this.wall.getNorth()) {
        this.drawBreakWall(x + 1, y, x - 1 + this.canvas.space, y, '#ffffff');
    }
    
    if(this.wall.getSouth()) {
        this.drawBreakWall(x + 1, y + this.canvas.space, x - 1 + this.canvas.space, y + this.canvas.space, '#ffffff');
    }

}

Cell.prototype.fillCell = function(color) {
    var x = this.y * this.canvas.space;
    var y = this.x * this.canvas.space;

    var canvas = this.canvas;

    this.canvas.timeout += 20;

    
    if(this.wall.getLeft()) {  
        this.drawBreakWall(x, y + 1, x, y + this.canvas.space - 1, color);
    }
    
    if(this.wall.getRight()) {
        this.drawBreakWall(x + this.canvas.space, y + 1, x + this.canvas.space, y - 1 + this.canvas.space, color);
    }
    
    if(this.wall.getNorth()) {
        this.drawBreakWall(x + 1, y, x - 1 + this.canvas.space, y, color);
    }
    
    if(this.wall.getSouth()) {
        this.drawBreakWall(x + 1, y + this.canvas.space, x - 1 + this.canvas.space, y + this.canvas.space, color);
    }
    
    setTimeout(
      function() {
        canvas.fillStyle = color;
        canvas.fillRect(x + 1, y + 1, canvas.space - 2, canvas.space - 2);
        canvas.fillStyle = '#000000';
      },
      this.canvas.timeout
    );
}

Cell.prototype.markAsSolution = function(line,column) {
    this.solution.changeValue(line,column);
    
    this.fillCell('#ffff00');
}

Cell.prototype.markAsBacktrack = function(line,column) {
    this.backtrack.changeValue(line,column);
    
    this.fillCell('#bbbbbb');
}

Cell.prototype.getPossiblyWays = function()  {
    
    var x = this.x;
    var y = this.y;
    
    var result = [];
    
    if(this.wall.getLeft()) {
        result.push(this.wall.indexOfLeft());
    }
    if(this.wall.getRight()) {
        result.push(this.wall.indexOfRight());
    }
    if(this.wall.getNorth()) {
        result.push(this.wall.indexOfNorth());
    }
    if(this.wall.getSouth()) {
        result.push(this.wall.indexOfSouth());
    }
    
    return result;
}

Cell.prototype.drawBegin = function() {
    var x = this.y * this.canvas.space;
    var y = this.x * this.canvas.space;
    this.canvas.fillStyle = '#0000ff';
    this.canvas.fillRect(x + 1, y + 1, this.canvas.space - 1, this.canvas.space - 1);
    this.canvas.fillStyle = '#000000';
}

Cell.prototype.drawEnd = function() {
    var x = this.y * this.canvas.space;
    var y = this.x * this.canvas.space;
    this.canvas.fillStyle = '#ff0000';
    this.canvas.fillRect(x + 1, y + 1, this.canvas.space - 1, this.canvas.space - 1);
    this.canvas.fillStyle = '#000000';
}


function Mazelado(canvas,line,column) {
    var maze = new Array();
    for ( var i = 0 ; i < line ; i++ ) {
        maze[i] = [];
        for ( var j = 0 ; j < column ; j++) {
            maze[i][j] = new Cell(canvas,i,j);
            maze[i][j].draw();
        }
    }    
    this.maze = maze;
    this.numberOfLines = line;
    this.numberOfColumns = column;
    this.totalOfCells = line*column;
    this.setBegin(0,0);
    this.setEnd(line-1,column-1);    
}

Mazelado.prototype.setBegin = function (line,column){
    this.startLine = line;
    this.startColumn = column;
    this.maze[this.startLine][this.startColumn].drawBegin();
}

Mazelado.prototype.setEnd = function(line,column) {
    this.endLine = line;
    this.endColumn = column;
    this.maze[this.endLine][this.endColumn].drawEnd();
}

Mazelado.prototype.generateDFS = function(){

    var cellLine = Math.floor(Math.random() * (this.numberOfLines));
    var cellColumn = Math.floor(Math.random() * (this.numberOfColumns));

    var currentCell = this.maze[cellLine][cellColumn];
    var visitedCells = 1;
    var totalOfCells = this.totalOfCells;

    var arrayOfCells = [];

    while ( visitedCells < totalOfCells ) {
        var neighborsCells = this.neighbors(currentCell);
        
        if ( neighborsCells.length ) {
            var totalNeighbors = neighborsCells.length;
            var indexOfchoosenCell = Math.floor((totalNeighbors) * Math.random());
            var chosenCell = neighborsCells[indexOfchoosenCell];
            this.knockDown(currentCell,chosenCell);
            arrayOfCells.push(currentCell);
            currentCell = chosenCell;
            visitedCells++;
        } else {
            currentCell = arrayOfCells.pop();
        }
    }

}

Mazelado.prototype.solved = false;

Mazelado.prototype.solve = function(currentCell,lastNode) {
    if ( !currentCell ) {    
        var currentCell = this.maze[this.startLine][this.startColumn];
    }    
    var endCell = this.maze[this.endLine][this.endColumn];
    if ( lastNode ) {
        lastNode.markAsSolution(currentCell.x,currentCell.y);
    }    
    
    if ( !this.solved && currentCell != endCell ) {                             
        var possiblyWays = currentCell.getPossiblyWays();        
        var possiblyWay = null;
        var line = null;
        var column = null;
        var nextNode = null;
        for ( var i = 0 ; i < possiblyWays.length ; i++ ) {
            possiblyWay =  possiblyWays[i];
            line = possiblyWay[0];
            column = possiblyWay[1];
            nextNode = this.maze[line][column];
            if ( nextNode != lastNode ) {                
                this.solve(nextNode,currentCell);                             
            } else {
                continue;
            }
        }
        if ( !this.solved ) {
            currentCell.markAsBacktrack(lastNode.x,lastNode.y);
        }
    } else {
        this.solved = true;
    }
    
}

Mazelado.prototype.neighbors = function (cell) {

    var neighbors = this.validNeighbors(cell);
    var result = [];
    
    for (var indexOfNeighbor = 0; indexOfNeighbor < neighbors.length; indexOfNeighbor++) {
        var cell = neighbors[indexOfNeighbor];
        if ( cell.wallIsIntact() ) {
            result.push(cell);
        }
    }

    return result;
}

Mazelado.prototype.validNeighbors = function (cell) {
   var line = cell.x;
   var column = cell.y;
   var result = [];
   if ( line ) result.push( this.maze[line-1][column] );
   if ( line < this.numberOfLines-1 ) result.push( this.maze[line+1][column] );
   if ( column ) result.push( this.maze[line][column-1] );
   if ( column < this.numberOfColumns-1) result.push( this.maze[line][column+1] );
   
   return result;
}

Mazelado.prototype.knockDown = function(cell, neighborCell) {
    cell.breakWall(neighborCell.x,neighborCell.y);
    neighborCell.breakWall(cell.x,cell.y);

    return true;
}


