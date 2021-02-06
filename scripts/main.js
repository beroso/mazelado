
var $canvas = $('maze');

var ctx = $canvas.getContext('2d');
ctx.space = 12;
ctx.lineWidth = 1;
ctx.timeout = 0;

ctx.drawLine = function(xi, yi, xf, yf) {
    this.beginPath();
    this.moveTo(xi, yi);
    this.lineTo(xf, yf);
    this.closePath();
    this.stroke();
}

$submitGenerate = $('submit-generate');
$submitSolve = $('submit-solve');
$submitReset = $('submit-reset');
$selectAlgorithm = $('select-algorithm');
$inputLine = $('input-line');
$inputColumn = $('input-column');

$imgLoadingGenerate = $('img-loading-generate');
$imgLoadingSolve = $('img-loading-solve');

var maze = null;

init = function() {
    ctx.timeout = 0;
    maze = null;
}

$submitGenerate.onclick = function(event) {
    try {
        init();
        var lines = parseInt($inputLine.value);
        var columns = parseInt($inputColumn.value);

        if(lines > 1 && columns > 1) {

            $imgLoadingGenerate.style.display = 'inline';
            
            $submitGenerate.setAttribute('disabled', 'disabled');
            $submitSolve.setAttribute('disabled', 'disabled');
            
            $canvas.width = columns * ctx.space;
            $canvas.height = lines * ctx.space;
            
            //ctx.clearRect(0, 0, $canvas.width, $canvas.height);
            ctx.strokeRect(0.5, 0.5, $canvas.width - 1, $canvas.height - 1);

            /*
            for(var x = 0; x < $canvas.width; x += ctx.space) {
                ctx.moveTo(0.5 + x, 0);
                ctx.lineTo(0.5 + x, $canvas.height);
            }
            
            for(var y = 0; y < $canvas.height; y += ctx.space) {
                ctx.moveTo(0, 0.5 + y);
                ctx.lineTo($canvas.width, 0.5 +  y);
            }
            
            ctx.stroke();
            */
            
            maze = new Mazelado(ctx, lines, columns);

            switch($selectAlgorithm.value) {
            case 'dfs':
                maze.generateDFS();
                break;
            case 'prim':
                maze.generatePrim();
                break;
            case 'kruskal':
                maze.generateKruskal();
                break;
            case 'kruskal-modificado':
                maze.generateKruskalModificado();
                break;
            default:
                break;
            }
            
            setTimeout(
                function() {
                    $submitGenerate.removeAttribute('disabled');
                    $submitSolve.removeAttribute('disabled');
                    $imgLoadingGenerate.style.display = 'none';
                },
                ctx.timeout
            );
        }
        else {
            throw new Error('Digite o numero de linhas e colunas corretamente');
        }
    }
    catch(e) {
        alert(e);
    }
    finally {
        return false;
    }
}

$submitSolve.onclick = function(event) {
    ctx.timeout = 0;

    $submitGenerate.setAttribute('disabled', 'disabled');
    $submitSolve.setAttribute('disabled', 'disabled');
    
    $imgLoadingSolve.style.display = 'inline';
    
    maze.solution();
    
    setTimeout(
    function() {
        $submitGenerate.removeAttribute('disabled');
        $imgLoadingSolve.style.display = 'none';
    },
    ctx.timeout
    );

    return false;
}

$submitReset.onclick = function() {
    location.reload(true);
    
    return false;
}

var $markStartCell = $('mark-start-cell');
var $markFinishCell = $('mark-finish-cell');
//var $menuWait = $('menu-wait');

function getMouseX(event) {
    return event.pageX - $canvas.offsetLeft;
}

function getMouseY(event) {
    return event.pageY - $canvas.offsetTop;
}

var lastCoordCanvasX = null;
var lastCoordCanvasY = null;

$markStartCell.onmousedown = function(e) {
    if(maze && lastCoordCanvasX >= 0 && lastCoordCanvasY >= 0 && !$submitSolve.getAttribute('disabled')) {
        
        var coordX = Math.floor(lastCoordCanvasY / ctx.space);
        var coordY = Math.floor(lastCoordCanvasX / ctx.space);
        
        maze.setBegin(coordX, coordY);
    }
    
    return false;
}
$markStartCell.onclick = $markStartCell.onmousedown;

$markFinishCell.onmousedown = function(e) {
    if(maze && lastCoordCanvasX >= 0 && lastCoordCanvasY >= 0  && !$submitSolve.getAttribute('disabled')) {
        
        var coordX = Math.floor(lastCoordCanvasY / ctx.space);
        var coordY = Math.floor(lastCoordCanvasX / ctx.space);
        
        maze.setEnd(coordX, coordY);
    }
    
    return false;
}
$markFinishCell.onclick = $markFinishCell.onmousedown


//context menu

var $contextMenu = $('context-menu');

function clickContextMenu(e) {
    var mouseEvent = e || event;
    if (mouseEvent.button == 2 || mouseEvent.button == 3) {
        
        lastCoordCanvasX = getMouseX(e);
        lastCoordCanvasY = getMouseY(e);
        
        mostrar(mouseEvent);
    }
    if (mouseEvent.button == 0 || mouseEvent.button == 1) {
        esconder();
    }
    
    return false;
}

$canvas.onmousedown = clickContextMenu;
$contextMenu.onmousedown = clickContextMenu;
$contextMenu.onmouseout = function(e){
    var mouseEvent = e || event;
    var element = mouseEvent.relatedTarget || mouseEvent.toElement; 
    if (element.nodeName != 'LI' && element.nodeName != 'A') {
        esconder();
    }
    
    return false;
};

$canvas.oncontextmenu = function(){
    return false;
};

function mostrar(e){
    $contextMenu.style.display = 'block';
    $contextMenu.style.top = e.pageY + 5 + 'px';
    $contextMenu.style.left = e.pageX + 5 + 'px';
    
    if(maze && lastCoordCanvasX >= 0 && lastCoordCanvasY >= 0 && !$submitSolve.getAttribute('disabled')) {
        $markStartCell.style.color = '#00f';
        $markFinishCell.style.color = '#f00';
    }
    else {
        $markStartCell.style.color = '#aaa';
        $markFinishCell.style.color = '#aaa';
    }
}

function esconder(){
    setTimeout(function(){
        $contextMenu.style.display = 'none';
    }, 100);
}

