

var intervalTimer = 1000;
var elementArray = [];
var positionLog = [];
var currentPos = 0;
var currentPos2 = -1;
var stepCounter = 0;

function startGame(numElements, density, gameType) {
    elementArray = [];
    positionLog = [];
    currentPos = 0;
    currentPos2 = -1;
    stepCounter = 0;
    xPosition = Math.floor(density/2);
    for (i = 0; i < numElements; i++){
        yValue = Math.floor(Math.random()*500) + 1;
        temp = new component(density, yValue, "green", xPosition, 0);
        positionLog.push(xPosition);
        xPosition += density + Math.floor(density/2);
        elementArray.push(temp);
    }
    verifyClear(gameType);
    console.log(positionLog.join());
    myGameArea.start(gameType);
}

function returnGame(gameType){
    if (gameType == "selection"){
        return selectionUpdate;
    }
    if (gameType == "bubble"){
        return bubbleUpdate;
    }
    if (gameType == "insertion"){
        return insertionUpdate;
    }
}

function verifyClear(gameType){
    if(gameType == "selection"){
        outerLoop = 0;
        currentMin = 0;
        innerLoop = 0;
    }
    if(gameType == "bubble"){
        outerLoop = 0;
        lastElements = 0;
        numberSwaps = 0;
        currentPos2 = 1;
    }
    if(gameType == "insertion"){
        outerLoop = 0;
        innerLoop = 0;
    }
}

var outerLoop = 0;
var currentMin = 0;
var innerLoop = 0;
function selectionUpdate(){
    if(outerLoop == elementArray.length){
        myGameArea.cancel();
    }else{
        if(innerLoop == elementArray.length){
            swapElements(currentMin, outerLoop);
            outerLoop += 1;
            innerLoop = outerLoop;
            currentMin = innerLoop;
            currentPos = innerLoop;
        }else{
            if(elementArray[currentMin].height > elementArray[innerLoop].height){
                currentMin = innerLoop;
                innerLoop += 1;
                currentPos = innerLoop;
            }else{
                innerLoop += 1;
                currentPos = innerLoop;
            }
        }
    }
    stepCounter += 1;
    updateGameArea();
}


var numberSwaps = 0;
var lastElements = 0;
function bubbleUpdate(){
    if(outerLoop + 1 == elementArray.length - lastElements && numberSwaps == 0 ){
        myGameArea.cancel();
    }else if(outerLoop + 1 == elementArray.length - lastElements){
        numberSwaps = 0;
        lastElements += 1;
        outerLoop = 0;
        currentPos = outerLoop;
        currentPos2 = outerLoop + 1;
    }else{
        if(elementArray[outerLoop + 1].height < elementArray[outerLoop].height){
            swapElements(outerLoop, outerLoop + 1);
            numberSwaps += 1;
        }
        outerLoop += 1;
        currentPos = outerLoop;
        currentPos2 = outerLoop + 1;
    }
    stepCounter += 1;
    updateGameArea();
}

function insertionUpdate(){
    if (outerLoop == elementArray.length){
        myGameArea.cancel();
    }else{
        if (innerLoop < 0){
            atemp = elementArray[outerLoop];
            elementArray.splice(outerLoop, 1);
            elementArray.splice(0, 0, atemp);
            fixPositions(outerLoop + 1);
            innerLoop = outerLoop;
            outerLoop += 1;
            currentPos = outerLoop;
        }else if(elementArray[innerLoop].height < elementArray[outerLoop].height){
            atemp = elementArray[outerLoop];
            elementArray.splice(outerLoop, 1);
            elementArray.splice(innerLoop + 1, 0, atemp);
            fixPositions(outerLoop + 1);
            innerLoop = outerLoop;
            outerLoop += 1;
            currentPos = outerLoop;
        }else{
            innerLoop -= 1;
            currentPos = innerLoop;
        }
    }
    stepCounter += 1;
    updateGameArea();
}

function swapElements(pos1, pos2){
    atemp = elementArray[pos1].x;
    elementArray[pos1].x = elementArray[pos2].x;
    elementArray[pos2].x = atemp;
    [elementArray[pos1], elementArray[pos2] ] = [elementArray[pos2], elementArray[pos1] ];
}

function fixPositions(aCount){
    for(i = 0; i < aCount; i++){
        elementArray[i].x = positionLog[i];
    }
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function(gameType) {
        this.canvas.width = 1100;
        this.canvas.height = 500;
        this.canvas.style.border = "2px solid";
        this.context = this.canvas.getContext("2d");
        this.gameT = gameType;
        div = document.getElementById("gameBox");
        div.appendChild(this.canvas);
        clearInterval(this.interval);
        this.interval = setInterval(returnGame(this.gameT), intervalTimer);
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    cancel : function(){
        clearInterval(this.interval);
    },
    updateTimer : function(){
        clearInterval(this.interval);
        myGameArea.interval = setInterval(returnGame(this.gameT), intervalTimer);
    }
}

function component(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.update = function(aBorder){
        
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
        }else if(aCount == currentPos2){
            x.update(true);
        }else{
            x.update(false);
        }
        aCount += 1;
    }
    if (currentPos == elementArray.length){
        currentPos = 0;
    }
    aString = " " + stepCounter.toString();
    document.getElementById("test2").innerHTML = aString;
    
}

function cancelFun(){
    myGameArea.cancel();
}

function changeTimer(tempS){
    intervalTimer = tempS;
    myGameArea.updateTimer();
}