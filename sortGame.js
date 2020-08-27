
var redGamePiece, blueGamePiece, yellowGamePiece;

function startGame() {
    redGamePiece = new component(75, 75, "red", 10, 10);
    yellowGamePiece = new component(75, 75, "yellow", 50, 60);    
    blueGamePiece = new component(75, 75, "blue", 10, 110);
    myGameArea.start();
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 720;
        this.canvas.height = 480;
        this.canvas.style.border = "1px solid";
        this.context = this.canvas.getContext("2d");
        div = document.getElementById("gameBox");
        div.appendChild(this.canvas);
        this.interval = setInterval(updateGameArea, 20);
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function component(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.update = function(){
        this.x += 1
        ctx = myGameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

function updateGameArea() {
    myGameArea.clear();
    redGamePiece.update();
    yellowGamePiece.update();        
    blueGamePiece.update();
}