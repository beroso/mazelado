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
