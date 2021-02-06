
function Mazelado(canvas,line,column) {
    this.numberOfLines = line;
    this.numberOfColumns = column;
    this.totalOfCells = line*column;

    var maze = new Array();
    for ( var i = 0 ; i < line ; i++ ) {
        maze[i] = [];
        for ( var j = 0 ; j < column ; j++) {
            maze[i][j] = new Cell(canvas,i,j);
            maze[i][j].draw();
        }
    }

    this.maze = maze;
    this.solve = new Solve(this.maze,true);
    
    var beginCell = this._getRandomCell();
    var endCell = null;
    
    do {
        endCell = this._getRandomCell();
    }
    while(endCell == beginCell);
    
    this.setBegin(beginCell.x, beginCell.y);
    this.setEnd(endCell.x, endCell.y);
}

Mazelado.prototype._neighbors = function (cell) {

    var neighbors = this._validNeighbors(cell);
    var result = [];

    for (var indexOfNeighbor = 0; indexOfNeighbor < neighbors.length; indexOfNeighbor++) {
        var cell = neighbors[indexOfNeighbor];
        if ( cell.wallIsIntact() ) {
            result.push(cell);
        }
    }

    return result;
}

Mazelado.prototype._validNeighbors = function (cell) {
    var line = cell.x;
    var column = cell.y;
    var result = [];
    if ( line ) result.push( this.maze[line-1][column] );
    if ( line < this.numberOfLines-1 ) result.push( this.maze[line+1][column] );
    if ( column ) result.push( this.maze[line][column-1] );
    if ( column < this.numberOfColumns-1) result.push( this.maze[line][column+1] );

    return result;
}

Mazelado.prototype._knockDown = function(cell, neighborCell) {
    cell.breakWall(neighborCell.x,neighborCell.y);
    neighborCell.breakWall(cell.x,cell.y);

    return true;
}

Mazelado.prototype._isGoingToKnockDownPrim = function (currentCell,destinyCell) {
    return destinyCell.wallIsIntact() || currentCell.wallIsIntact();
}

Mazelado.prototype._isGoingToKnockDownKruskal = function(currentCell,destinyCell) {
    if ( this._isGoingToKnockDownPrim(currentCell,destinyCell) ) {
        return true;
    } else {
        solve = new Solve(this.maze,false);
        solve.beginCell = currentCell;
        solve.endCell = destinyCell;
        solve.execute();
        return !solve.solved;
    }
}

Mazelado.prototype._fillWallDensity = function() {
    var currentCell = null;
    var northCell = null;
    var leftCell = null;
    for ( var i = 0 ; i < this.numberOfLines ; i++ ) {
        for ( var j = 0 ; j < this.numberOfColumns ; j++) {
            currentCell = this.maze[i][j];
            var northIndex = currentCell.indexOfNorth();
            var leftIndex = currentCell.indexOfLeft();
            northCell = (this._cellExists(northIndex[0],northIndex[1])) ? this.maze[northIndex[0]][northIndex[1]] : null;
            leftCell = (this._cellExists(leftIndex[0],leftIndex[1])) ? this.maze[leftIndex[0]][leftIndex[1]] : null ;
            currentCell.setWallsDensitys({
north: (northCell) ? northCell.getWallsDensitys({south: true})[0]: null,
left: (leftCell) ? leftCell.getWallsDensitys({right: true})[0]: null
            });
        }
    }
}

Mazelado.prototype._sortFunction = function (value1,value2) {
    return value1[0]-value2[0];
}

Mazelado.prototype._getSortedListOfWalls = function () {
    var sortedListOfWalls = []
    var currentCell = null;
    for ( var i = 0 ; i < this.numberOfLines ; i++ ) {
        for ( var j = 0 ; j < this.numberOfColumns ; j++) {
            currentCell = this.maze[i][j];
            sortedListOfWalls = sortedListOfWalls.concat(currentCell.getWallsDensitys({
south: true,
right: true
            }));
        }
    }
    sortedListOfWalls = sortedListOfWalls.sort(this._sortFunction);
    return sortedListOfWalls;
}

Mazelado.prototype._cellExists = function(line,column){
    return this.maze[line] && this.maze[line][column];
}

Mazelado.prototype._getCellAt = function(line, column) {
    return (this._cellExists(line, column)) ? this.maze[line][column] : null
}

Mazelado.prototype.eraseCell = function(line, column) {
    this._getCellAt(line, column).erase();
}

Mazelado.prototype.setBegin = function (line,column){

    if(this.startLine >= 0 && this.startColumn >= 0) {
        this.eraseCell(this.startLine, this.startColumn);
    }

    this.startLine = line;
    this.startColumn = column;
    var beginCell = this.maze[this.startLine][this.startColumn];
    beginCell.drawBegin();
    this.solve.beginCell = beginCell;
}

Mazelado.prototype._getBegin = function () {
    return this.maze[this.startLine][this.startColumn];
}

Mazelado.prototype.setEnd = function(line,column) {

    if(this.endLine >= 0 && this.endColumn >= 0) {
        this.eraseCell(this.endLine, this.endColumn);
    }

    this.endLine = line;
    this.endColumn = column;
    var endCell = this.maze[this.endLine][this.endColumn];
    endCell.drawEnd();
    this.solve.endCell = endCell;
    return this.maze[this.endLine][this.endColumn];
}

Mazelado.prototype.solution = function () {
    this.solve.execute();
}

Mazelado.prototype._getRandomCell = function() {
    var cellLine = Math.floor(Math.random() * (this.numberOfLines));
    var cellColumn = Math.floor(Math.random() * (this.numberOfColumns));
    return this.maze[cellLine][cellColumn];
}

Mazelado.prototype.generateDFS = function(){

    var currentCell = this._getRandomCell();
    var visitedCells = 1;
    var totalOfCells = this.totalOfCells;

    var arrayOfCells = [];

    while ( visitedCells < totalOfCells ) {
        var neighborsCells = this._neighbors(currentCell);

        if ( neighborsCells.length ) {
            var totalNeighbors = neighborsCells.length;
            var indexOfchoosenCell = Math.floor((totalNeighbors) * Math.random());
            var chosenCell = neighborsCells[indexOfchoosenCell];
            this._knockDown(currentCell,chosenCell);
            arrayOfCells.push(currentCell);
            currentCell = chosenCell;
            visitedCells++;
        } else {
            currentCell = arrayOfCells.pop();
        }
    }

}

Mazelado.prototype.generateKruskal = function () {
    this._fillWallDensity();
    var sortedListOfWalls = this._getSortedListOfWalls();
    var currentCell = null;
    var destinyCell = null;
    var wall = null;
    var solve = null;
    var lineOfCurrentCell = null;
    var columnOfCurrentCell = null;
    var lineOfDestinyCell = null;
    var columnOfDestinyCell = null;
    for ( var indexOfWall = 0 ; indexOfWall < sortedListOfWalls.length ; indexOfWall++ ) {
        wall = sortedListOfWalls[indexOfWall];
        lineOfCurrentCell = wall[1];
        columnOfCurrentCell = wall[2];
        currentCell = this._getCellAt(lineOfCurrentCell,columnOfCurrentCell);
        lineOfDestinyCell = wall[3];
        columnOfDestinyCell = wall[4];
        destinyCell = this._getCellAt(lineOfDestinyCell,columnOfDestinyCell);
        if ( destinyCell && currentCell ) {
            if ( this._isGoingToKnockDownKruskal(currentCell,destinyCell) ) {
                this._knockDown(currentCell,destinyCell);
            }
        }
    }
}

Mazelado.prototype.generatePrim = function() {
    this._fillWallDensity();
    var currentCell = null;
    var destinyCell = this._getRandomCell();
    var lineOfCurrentCell = null;
    var columnOfCurrentCell = null;
    var lineOfDestinyCell = null;
    var columnOfDestinyCell = null;
    var wall = null;
    var broke = true;
    var priorityQueue = [];
    do {
        if ( destinyCell && broke ) {
            priorityQueue = priorityQueue.concat(destinyCell.getWallsDensitys());
            priorityQueue = priorityQueue.sort(this._sortFunction);
        }
        wall = priorityQueue.shift();
        broke = false;
        lineOfCurrentCell = wall[1];
        columnOfCurrentCell = wall[2];
        currentCell = this._getCellAt(lineOfCurrentCell,columnOfCurrentCell);
        lineOfDestinyCell = wall[3];
        columnOfDestinyCell = wall[4];
        destinyCell = this._getCellAt(lineOfDestinyCell,columnOfDestinyCell);
        if ( destinyCell && currentCell ) {
            if ( this._isGoingToKnockDownPrim(currentCell,destinyCell) ) {
                broke = true;
                this._knockDown(currentCell,destinyCell);
            }
        }
    } while ( priorityQueue.length );
}

Mazelado.prototype._getListOfCellsAndListOfWalls = function() {
    var cells = [];
    var walls = [];

    var currentCell = null;

    for(var i = 0; i < this.numberOfLines; i++) {
        for(var j = 0; j < this.numberOfColumns; j++) {
            cell = this.maze[i][j];
            cells.push(cell);
            walls.push([[cell.wall.line, cell.wall.column], cell.wall.indexOfNorth()]);
            //walls.push([[cell.wall.line, cell.wall.column], cell.wall.indexOfSouth()]);
            //walls.push([[cell.wall.line, cell.wall.column], cell.wall.indexOfLeft()]);
            walls.push([[cell.wall.line, cell.wall.column], cell.wall.indexOfRight()]);
        }
    }

    return {listOfCells: cells, listOfWalls: walls};
}

Mazelado.prototype.generateKruskalModificado = function() {
    var cellsAndWalls = this._getListOfCellsAndListOfWalls();
    var cells = cellsAndWalls.listOfCells;
    var listOfWalls = cellsAndWalls.listOfWalls;
    var uf = new UnionFind(cells);
    var numberOfSets = cells.length;

    var currentCell = null;
    var lineOfCurrentCell = null;
    var columnOfCurrentCell = null;
    var destinyCell = null;
    var lineOfDestinyCell = null;
    var columnOfDestinyCell = null;
    var indexOfChoosenWall = null;
    var choosenWall = null;

    while(numberOfSets > 1) {
        indexOfChoosenWall = Math.floor(Math.random() * (listOfWalls.length));
        choosenWall = listOfWalls.splice(indexOfChoosenWall, 1);
        choosenWall = choosenWall[0];

        lineOfCurrentCell = choosenWall[0][0];
        columnOfCurrentCell = choosenWall[0][1];

        currentCell = this._getCellAt(lineOfCurrentCell, columnOfCurrentCell);

        if(currentCell) {
            lineOfDestinyCell = choosenWall[1][0];
            columnOfDestinyCell = choosenWall[1][1];

            destinyCell = this._getCellAt(lineOfDestinyCell, columnOfDestinyCell);
            if (destinyCell) {
                if(!uf.ufFind(currentCell, destinyCell)) {
                    this._knockDown(currentCell,destinyCell);
                    uf.union(currentCell, destinyCell);
                    numberOfSets--;
                }
            }
        }
    }

}