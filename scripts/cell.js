
function Cell(canvas,x,y) {
    Element.call(this,x,y);
    this.x = x;
    this.y = y;
    this.canvas = canvas;
    this.backtrack = new Element(x,y);
    this.solution = new Element(x,y);
    this.border = new Element(x,y);
    this.wall = new Element(x,y);
    this.wallDensity = new Density(x,y);
}
Cell.inherit(Element);

Cell.prototype.draw = function() {
    this.canvas.strokeRect(this.y*this.canvas.space,this.x*this.canvas.space, this.canvas.space, this.canvas.space);
}

Cell.prototype.erase = function() {
    var x = this.y * this.canvas.space;
    var y = this.x * this.canvas.space;
    this.canvas.fillStyle = '#ffffff';
    this.canvas.fillRect(x + 1, y + 1, this.canvas.space - 2, this.canvas.space - 2);
    this.canvas.fillStyle = '#000000';
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
    
    this.fillCell('#00ff00');
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
    this.canvas.fillStyle = '#00aaff';
    this.canvas.fillRect(x + 1, y + 1, this.canvas.space - 2, this.canvas.space - 2);
    this.canvas.fillStyle = '#000000';
}

Cell.prototype.drawEnd = function() {
    var x = this.y * this.canvas.space;
    var y = this.x * this.canvas.space;
    this.canvas.fillStyle = '#ff0000';
    this.canvas.fillRect(x + 1, y + 1, this.canvas.space - 2, this.canvas.space - 2);
    this.canvas.fillStyle = '#000000';
}

Cell.prototype.setWallsDensitys = function(obj) {
    obj.right = Math.round(Math.random()*100);;
    obj.south = Math.round(Math.random()*100);;

    this.wallDensity.setDensity(obj);
}

Cell.prototype.getWallsDensitys = function(sortFunction) {
    return this.wallDensity.getDensity(sortFunction);
}