
function Density(line,column) {
    Element.call(this,line,column);
}
Density.inherit(Element);

Density.prototype.setDensity = function(obj) {
    var indexes = [[this.indexOfRight(),'right'],[this.indexOfSouth(),'south'],[this.indexOfNorth(),'north'],[this.indexOfLeft(),'left']];
    var currentIndex = null;
    var currentLine = null;
    var currentColumn = null;
    var sideValue = null;
    var currentSide = null;
    for ( var indexOfIndexes = 0 ; indexOfIndexes < indexes.length ;  indexOfIndexes++  ) {
        currentIndex = indexes[indexOfIndexes][0];
        currentSide = indexes[indexOfIndexes][1];
        sideValue = obj[currentSide];
        currentLine = currentIndex[0];
        currentColumn = currentIndex[1];
        this.changeValue(currentLine,currentColumn,sideValue);
    }
}

Density.prototype.getDensity = function(obj) {
    var result = [];
    var indexes = [[this.indexOfRight(),this.getRight(),'right'],[this.indexOfSouth(),this.getSouth(),'south'],[this.indexOfNorth(),this.getNorth(),'north'],[this.indexOfLeft(),this.getSouth(),'left']];
    var currentIndex = null;
    var sideValue = null;
    var currentLine = null;
    var currentColumn = null;
    var currentSide = null;
    for ( var indexOfIndexes = 0 ; indexOfIndexes < indexes.length ;  indexOfIndexes++  ) {
        currentIndex = indexes[indexOfIndexes][0];
        sideValue = indexes[indexOfIndexes][1];
        currentSide = indexes[indexOfIndexes][2];
        currentLine = currentIndex[0];
        currentColumn = currentIndex[1];
        if ( !obj || obj[currentSide] ) {
            result.push([sideValue,this.line,this.column,currentLine,currentColumn]);
        }
    }
    return result;
}