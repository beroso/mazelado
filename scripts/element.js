
function Element(line,column){
    this.line = line;
    this.column = column;

    this[line]   = [];
    this[line-1] = [];
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

Element.prototype.changeValue = function(line,column,value) {
    this[line][column] = (value !== undefined) ? value : !this[line][column];
}

Element.prototype.isZero = function () {
    return !this.getLeft() && !this.getRight() && !this.getNorth() && !this.getSouth();
}