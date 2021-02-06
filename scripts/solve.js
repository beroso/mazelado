
function Solve(maze,visualEffects) {
    this.maze = maze;
    this.visualEffects = visualEffects;
}
Solve.prototype.beginCell = null;
Solve.prototype.endCell = null;

Solve.prototype.solved = false;

Solve.prototype.execute = function(currentCell,lastNode) {
    if ( !currentCell ) {
        var currentCell = this.beginCell;
    }
    var endCell = this.endCell;
    if ( lastNode && lastNode != this.beginCell && this.visualEffects ) {
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
                this.execute(nextNode,currentCell);
            } else {
                continue;
            }
        }
        if ( !this.solved && this.visualEffects ) {
            currentCell.markAsBacktrack(lastNode.x,lastNode.y);
        }
    } else {
        this.solved = true;
    }

}