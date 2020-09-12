

var intervalTimer = 1000;
var elementArray = [];
var positionLog = [];
var currentPos = 0;
var currentPos2 = -1;
var stepCounter = 0;
var skipSpeed = 1;
var skipCounter = 0;

function adjustBoxes(numBoxes, mapSize, atype){
    numBoxes = parseInt(numBoxes);
    mapSize = parseInt(mapSize);
    atype = parseInt(atype);
    boxDensity = numBoxes;
    if(atype == 1){
        density = Math.floor((mapSize*2) / (3*numBoxes + 1));
        boxDensity = density;
    }else{
        density = numBoxes;
    }
    numberLevels = mapSize - Math.floor(.5*density);
    numberLevels = numberLevels/(density + Math.floor(.5*density));
    overage = Math.ceil(numberLevels) * (density + Math.floor(.5*density)) - (mapSize - 2);
    
    console.log(overage + " " + Math.ceil(numberLevels) + " " + density*1.5);
    console.log(Math.floor(.35*density - 2)*Math.ceil(numberLevels));
    
    yFix = 0;
    if ( overage >= Math.floor(.35*density - 2)*Math.ceil(numberLevels)){
        numberLevels = Math.floor(numberLevels);
    }else{
        numberLevels = Math.ceil(numberLevels);
        while(true){
            yFix += 1;
            if (yFix * numberLevels >= overage){
                break;
            }
        }
        while (true){
            overage = Math.ceil(numberLevels) * (density + Math.floor(.5*density) - yFix) - (mapSize - 2);
            if(overage < 0 && overage * -1 > (density + Math.floor(.5*density) - yFix)){
                numberLevels += 1;
            }else{
                break;
            }
        }
        density = density - yFix;
    }
    returnList = [numberLevels, density, boxDensity];
    return returnList;
}

function startGame(numElements, gameType) {
    elementArray = [];
    positionLog = [];
    currentPos = 0;
    currentPos2 = -1;
    stepCounter = 0;
    skipCounter = 0;
    
    xValues = adjustBoxes(parseInt(numElements), 1100, 1);
    numElements = xValues[0];
    xPosition = Math.floor(xValues[1]/2);
    console.log(numElements + " " + xValues[1] + " " + xValues[2]);
    
    for (i = 0; i < numElements; i++){
        yValue = Math.floor(Math.random()*500) + 1;
        temp = new component(xValues[2], yValue, "green", xPosition, 0);
        positionLog.push(xPosition);
        xPosition += xValues[1] + Math.floor(xValues[1]/2);
        elementArray.push(temp);
    }
    verifyClear(gameType);
    myGameArea.start(gameType);
    updateGameArea();
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
    if (gameType == "heap"){
        return heapsortUpdate;
    }
    if (gameType == "quick"){
        return quicksortUpdate;
    }
    if (gameType == "merge"){
        return mergesortUpdate;
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
    if(gameType == "heap"){
        heapBottom = 0;
        heapTop = elementArray.length - 1;
    }
    if (gameType == "quick"){
        recStack = [];
        recStack.push([0, elementArray.length - 1]);
        currentPos = -1;
        pivitCopys = 0;
    }
    if (gameType == "merge"){
        maxLevel = 0;
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
    skipCounter += 1;
    if(skipCounter != skipSpeed){
        selectionUpdate();
    }else{
        updateGameArea();
        skipCounter = 0;
    }
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
    skipCounter += 1;
    if(skipCounter != skipSpeed){
        bubbleUpdate();
    }else{
        updateGameArea();
        skipCounter = 0;
    }
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
    skipCounter += 1;
    if(skipCounter != skipSpeed){
        insertionUpdate();
    }else{
        updateGameArea();
        skipCounter = 0;
    }
}

var heapBottom = 0;
var heapTop = 0;
function heapsortUpdate(){
    //children of index n at 2n + 1 and 2n + 2
    //parent of n at floor( (n-1)/2 )
    
    if(heapBottom != elementArray.length){
        if(heapInsert()){
            heapBottom++;
            currentPos = heapBottom;
        }
        if(heapBottom == elementArray.length){
            currentPos = 0;
        }
    }else{
        //extract the element at position 0 and move to index heapBottom
        //When all complete heapBottom == -1 break
        if(heapTop == 0){
            updateGameArea();
            cancelFun();
            //checkStatus();
            return;
        }else if(heapExtract()){
            swapElements(0, heapTop);
            heapTop--;
            currentPos = 0;
        }
    }
    
    
    stepCounter += 1;
    skipCounter += 1;
    if(skipCounter != skipSpeed){
        heapsortUpdate();
    }else{
        updateGameArea();
        skipCounter = 0;
    }
}

function heapInsert(){
    hParent = Math.floor((currentPos - 1)/2);
    if(hParent < 1){
        return true;
    }
    if(elementArray[hParent].height > elementArray[currentPos].height){
        return true;
    }else{
        swapElements(hParent, currentPos);
        currentPos = hParent;
        return false;
    }
}

function heapExtract(){
    hchild1 = 2*currentPos + 1;
    hchild2 = 2*currentPos + 2;
    testing = elementArray[currentPos].height;
    if(hchild1 > heapTop || hchild2 > heapTop){
        if(hchild1 <= heapTop && elementArray[hchild1].height > testing){
            swapElements(currentPos, hchild1);
        }
        return true;
    }
    if(testing > elementArray[hchild1].height && testing > elementArray[hchild2].height){
        return true;
    }else{
        if(elementArray[hchild1].height > elementArray[hchild2].height){
            swapElements(currentPos, hchild1);
            currentPos = hchild1;
        }else{
            swapElements(currentPos, hchild2);
            currentPos = hchild2;
        }
        return false;
    }
}

var recStack = [];
var pivitCopys = 0;
function quicksortUpdate(){
    if(recStack.length == 0){
        cancelFun();
        updateGameArea();
        //checkStatus();
        return;
    }
    if(currentPos == -1){
        stLength = recStack[0][1] - recStack[0][0];
        currentPos = Math.floor(Math.random()*stLength) + recStack[0][0];
        swapElements(currentPos, recStack[0][0]);
        currentPos = recStack[0][0];
        currentPos2 = currentPos + 1;
    }else{
        if(elementArray[currentPos].height < elementArray[currentPos2].height){
            currentPos2++;
        }else if (elementArray[currentPos].height > elementArray[currentPos2].height){
            insertElement(currentPos2, currentPos - pivitCopys);
            currentPos2++;
            currentPos++;
        }else{
            insertElement(currentPos2, currentPos + 1);
            currentPos++;
            pivitCopys++;
            currentPos2++;
        }
        if(currentPos2 > recStack[0][1]){
            //console.log("-----");
            //printRec();
            //console.log("cur1: " + currentPos + " cur2: " + currentPos2 + " piv: " + pivitCopys);
            solve = recStack[0][0] - (currentPos - pivitCopys);
            if( Math.abs(solve) > 1 ){
                recStack.push([recStack[0][0], (currentPos - pivitCopys) - 1 ]);
            }
            if(Math.abs(currentPos - recStack[0][1]) > 1){
               recStack.push([currentPos + 1, recStack[0][1] ]);
            }
            recStack.splice(0, 1);
            currentPos = -1;
            pivitCopys = 0;
        }
    }
    stepCounter += 1;
    skipCounter += 1;
    if(skipCounter != skipSpeed){
        quicksortUpdate();
    }else{
        updateGameArea();
        skipCounter = 0;
    }
}

var sortLevel = 0;
var maxLevel = 0;
var nextStartPoint = 0;
var leftRange = [];
var rightRange = [];
function mergesortUpdate(){
    /*
    console.log("-----");
    console.log("Ml: " + maxLevel + ", Sl: " + sortLevel);
    console.log("NSP: " + nextStartPoint + ", P1: " + currentPos + ", P2: " + currentPos2);
    if(currentPos >= 0 && currentPos2 >= 0 && currentPos < elementArray.length && currentPos2 < elementArray.length){
        console.log("E1: " + elementArray[currentPos].height + ", E2: " + elementArray[currentPos2].height);
    }else{
        console.log("E1: ---" + ", E2: ---");
    }
    console.log(leftRange.join());
    console.log(rightRange.join());
    */
    if(maxLevel == 0){
        maxLevel = Math.log10(elementArray.length) / Math.log10(2);
        maxLevel = Math.pow(2, Math.floor(maxLevel));
        sortLevel = 1;
        currentPos = 0;
        currentPos2 = 1;
        leftRange = [0, 0];
        rightRange = [1, 1];
        nextStartPoint = 2;
    }else{
        if(currentPos > leftRange[1] || currentPos2 > rightRange[1]){
            if (nextStartPoint == -1){
                sortLevel *= 2;
                if (sortLevel > maxLevel){
                    cancelFun();
                    updateGameArea();
                    //checkStatus();
                    return;
                }
                currentPos = 0;
                currentPos2 = sortLevel;
                leftRange = [0, sortLevel - 1];
                rightRange = [sortLevel, sortLevel + sortLevel - 1];
                nextStartPoint = rightRange[1] + 1;
                if (leftRange[1] >= elementArray.length){
                    leftRange[1] = elementArray.length - 1;
                    nextStartPoint = -1;
                }
                if (rightRange[1] >= elementArray.length){
                    rightRange[1] = elementArray.length - 1;
                    nextStartPoint = -1;
                }
            }else{
                currentPos = nextStartPoint;
                currentPos2 = nextStartPoint + sortLevel;
                leftRange = [currentPos, currentPos + sortLevel - 1];
                if (leftRange[1] >= elementArray.length){
                    leftRange[1] = elementArray.length - 1;
                    nextStartPoint = -1;
                }
                rightRange = [currentPos2, currentPos2 + sortLevel - 1];
                if (rightRange[1] >= elementArray.length){
                    rightRange[1] = elementArray.length - 1;
                    nextStartPoint = -1;
                }else{
                    nextStartPoint = rightRange[1] + 1;
                }
            }
        }else{
            if (elementArray[currentPos].height <= elementArray[currentPos2].height){
                currentPos += 1;
                leftRange[0] += 1;
            }else{
                insertElement(currentPos2, currentPos);
                currentPos += 1;
                currentPos2 += 1;
                leftRange[0] += 1;
                leftRange[1] += 1;
                rightRange[0] += 1;
            }
        }
    }
    
    
    stepCounter += 1;
    skipCounter += 1;
    if(skipCounter != skipSpeed){
        mergesortUpdate();
    }else{
        updateGameArea();
        skipCounter = 0;
    }
}

function checkStatus(){
    previous = -1;
    document.getElementById("test3").innerHTML = "  Correct";
    for(x of elementArray){
        if(x.height < previous){
            document.getElementById("test3").innerHTML = "  Wrong";
            break;
        }
        previous = x.height;
    }
}

function printRec(){
    count = 0;
    for(x of recStack){
        console.log(count + " " + x.join());
        count++;
    }
}

function insertElement(elNum, newPos){
    //printArray();
    atemp = elementArray[elNum].x;
    if(elNum > newPos){
        elementArray[elNum].x = elementArray[newPos].x;
        start = elNum - 1;
        while(start >= newPos){
            atemp2 = elementArray[start].x;
            elementArray[start].x = atemp;
            atemp = atemp2;
            start--;
        }
        atemp = elementArray.splice(elNum, 1);
        //printArray();
        elementArray.splice(newPos, 0, atemp[0]);
        //console.log(atemp);
    }else if (elNum < newPos){
        elementArray[elNum].x = elementArray[newPos].x;
        start = elNum + 1;
        while(start <= newPos){
            atemp2 = elementArray[start].x;
            elementArray[start].x = atemp;
            atemp = atemp2;
            start++;
        }
        atemp = elementArray.splice(elNum, 1);
        elementArray.splice(newPos + 1, 0, atemp[0]);
    }
    //printArray();
}

function printArray(){
    temp = [];
    for(x of elementArray){
        temp.push(x.height);
    }
    console.log(temp.join());
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