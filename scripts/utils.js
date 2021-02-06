
Function.prototype.inherit = function ( mother ){
    var f = function (){
    }
    f.prototype = mother.prototype
    this.prototype = new f()

    var str = this.toString()
    var name = str.substring( 9, str.indexOf( "(") )

    // Realiza o trim manualmente
    var begin = 0
    while ( begin < name.length && name.charAt(begin) == " " ){
        begin++
    }

    var end = name.length - 1
    while ( end > 0 && name.charAt(end) == " " ){
        end--
    }

    name = name.substr( begin, end - begin + 1)

    this.prototype.constructorName = name
}

$ = function(elementId, context) {
    context = context || document;
    return context.getElementById(elementId);
}
