

var intervalTimer;
var elementArray = [];
var currentPos = 0;

function startGame(intTime, numElements, density) {
    intervalTimer = intTime;
    elementArray = [];
    currentPos = 0;
    xPosition = Math.floor(density/2);
    for (i = 0; i < numElements; i++){
        yValue = Math.floor(Math.random()*500) + 1;
        temp = new component(density, yValue, "green", xPosition, 0);
        xPosition += density + Math.floor(density/2);
        elementArray.push(temp);
    }
    myGameArea.start();
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 1100;
        this.canvas.height = 500;
        this.canvas.style.border = "2px solid";
        this.context = this.canvas.getContext("2d");
        div = document.getElementById("gameBox");
        div.appendChild(this.canvas);
        clearInterval(this.interval);
        this.interval = setInterval(updateGameArea, intervalTimer);
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
    this.update = function(aBorder){
        aString = " " + currentPos.toString();
        document.getElementById("test2").innerHTML = aString;
        
        ctx = myGameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        if(aBorder){
            ctx.fillStyle = "red";
            ctx.fillRect(this.x - 2, this.y, 2, this.height);
            ctx.fillRect(this.x + this.width, this.y, 2, this.height);
            ctx.fillRect(this.x - 2, this.height, this.width + 4, 2);
        }
    }
}

function updateGameArea() {
    myGameArea.clear();
    aCount = 0;
    for (x of elementArray){
        if (aCount == currentPos){
            x.update(true);
        }else{
            x.update(false);
        }
        aCount += 1;
    }
    currentPos += 1;
    if (currentPos == elementArray.length){
        currentPos = 0;
    }
    
}