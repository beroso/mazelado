/*
function UnionFind(arrayOfCells) {
    this.arrayOfCells = [];
    
    for(var i = 0; i < arrayOfCells.length; i++) {
        this.arrayOfCells.push([arrayOfCells[i]]);
    }
}

//retorna o índice do conjunto
UnionFind.prototype.find = function(cell) {
    var length = this.arrayOfCells.length;

    for(var i = 0; i < length; i++) {
        for(var j = 0; j < this.arrayOfCells[i].length; j++) {
            if(this.arrayOfCells[i][j] == cell) {
                return i;
            }
        }
    }
    
    return false;
}

UnionFind.prototype.ufFind = function(cellFrom, cellTo) {
    return this.find(cellFrom) == this.find(cellTo);
}

UnionFind.prototype.union = function(cellFrom, cellTo) {
    var i = this.find(cellFrom);
    var j = this.find(cellTo);

    if(i == j) {
        return;
    }
    
    if(i < j) {
        j--;
    }
    
    var setOfCellFrom = this.arrayOfCells.splice(i, 1);

    this.arrayOfCells[j] = this.arrayOfCells[j].concat(setOfCellFrom[0]);
}
*/

//UnionFind modificado
function UnionFind(arrayOfCells) {
    this.arrayOfCells = [];
    
    for(var i = 0; i < arrayOfCells.length; i++) {
        this.arrayOfCells.push([arrayOfCells[i]]);
        arrayOfCells[i].idUF = i;
    }
}

UnionFind.prototype.ufFind = function(cellFrom, cellTo) {
    return cellFrom.idUF == cellTo.idUF;
}

UnionFind.prototype.union = function(cellFrom, cellTo) {

    var i = cellFrom.idUF;
    var j = cellTo.idUF;
    
    if(i == j) {
        return;
    }

    var setOfCellFrom = this.arrayOfCells.slice(i, i + 1)[0];
    
    for(var x = 0; x < setOfCellFrom.length; x++) {
        setOfCellFrom[x].idUF = j;
    }
    
    this.arrayOfCells[i] = null;
    
    this.arrayOfCells[j] = this.arrayOfCells[j].concat(setOfCellFrom);
    
}
