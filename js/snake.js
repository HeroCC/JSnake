
/**
* @module Snake
* @class SNAKE
*/

var SNAKE = SNAKE || {};
var snake_color = " snake-yellow-alive";
var snakeSpeed = 75,
    growthIncr = 5;
var currentColor = "yellow";
var isS2Dead = false,
    isS1Dead = false;
var winner = 0;
function changeSnakeColor(color) {
    if (color == "#3ece01") color = "green";
    if (color == "#b200ff") color = "purple";
    
    
    var body = document.getElementsByClassName("snake-snakebody-block");
    for (var i = 0; i < body.length; i++) {
    
        if (body[i].className.search("S2") > -1) {
            var S2 = " S2";
            snake_color = " snake-lightblue-alive";
            console.log("lb");
        } else {
            var S2 = " S1";
            snake_color = " snake-" + color + "-alive";
            console.log("or")
        }
        //body[i].className([1])
        body[i].className = "snake-snakebody-block" + snake_color + S2;
    }
    
}

function removeObst() {
    var obst = document.getElementsByClassName('snake-obstacle');
    while (obst[0]) {
        obst[0].parentNode.removeChild(obst[0]);
    }
}
function changeMode(button, color) {
    buttonList = ["button0", "button1", "button2", "button3", "button4", "button5"]
    if (currentColor === "blue" && color !== "blue") {
        removeObst();
    }
    if (currentColor === "orangered" && color !== "orangered") {
        //delete second snake & set rules
    }
    title_icon = document.getElementById("title_icon")
    changeSnakeColor(color)
    if (color == "purple") color = "#b200ff", snakeSpeed = 45, growthIncr = 100, title_icon.setAttribute('href', "css/images/snakeblock_purple.png");//insane
    if (color == "green") color = "#3ece01", snakeSpeed = 75, growthIncr = 100, title_icon.setAttribute('href', "css/images/snakeblock_green.png");//long
    if (color == "yellow") snakeSpeed = 75, growthIncr = 5, title_icon.setAttribute('href', "css/images/snakeblock.png");//regular
    if (color == "red") snakeSpeed = 40, growthIncr = 10, title_icon.setAttribute('href', "css/images/snakeblock_red.png");//fast
    if (color == "blue") snakeSpeed = 60, growthIncr = 10, title_icon.setAttribute('href', "css/images/snakeblock_blue.png");//obstacle
    if (color == "orangered") snakeSpeed = 75, growthIncr = 5, title_icon.setAttribute('href', "css/images/snakeblock_orangered.png");//2play
    if (color === "orangered") {
        var Snake2_body = document.getElementsByClassName("S2"), i, len;
        for (i = 0, len = Snake2_body.length; i < len; i++) {
            Snake2_body[i].style.zIndex = "1";
        }
    }
    else {
        var Snake2_body = document.getElementsByClassName("S2"), i, len;
        for (i = 0, len = Snake2_body.length; i < len; i++) {
            Snake2_body[i].style.zIndex = "-1";
        }
    }
    for (var x = 0; x < buttonList.length; x++) {
        
        if (buttonList[x] == button) {
            
            this.currentColor = color;
            
            document.getElementById(buttonList[x]).style.boxShadow = "inset 0px -20px 0px " + color;
            
            var titles = document.getElementsByClassName("JSSTitle"), i, len;

            for (i = 0, len = titles.length; i < len; i++) {
                titles[i].style.color = color;
            }
            //document.getElementById(button).style.background = color;
            document.getElementById("tryAgainButton").style.background = color;
            document.getElementById("welcomeButton").style.background = color;

            var elements = document.getElementsByClassName("snake-food-block"), i, len;

            for (i = 0, len = elements.length; i < len; i++) {
                elements[i].style.border = "2px solid " + color;
            }
        }
        else {
            document.getElementById(buttonList[x]).style.boxShadow = "inset 0px -4px 0px " + color;
            document.getElementById(buttonList[x]).style.background = "";
        }
    }
}
/**
* @method addEventListener
* @param {Object} obj The object to add an event listener to.
* @param {String} event The event to listen for.
* @param {Function} funct The function to execute when the event is triggered.
* @param {Boolean} evtCapturing True to do event capturing, false to do event bubbling.
*/

SNAKE.addEventListener = (function() {
    if (window.addEventListener) {
        return function(obj, event, funct, evtCapturing) {
            obj.addEventListener(event, funct, evtCapturing);
        };
    } else if (window.attachEvent) {
        return function(obj, event, funct) {
            obj.attachEvent("on" + event, funct);
        };
    }
})();

/**
* @method removeEventListener
* @param {Object} obj The object to remove an event listener from.
* @param {String} event The event that was listened for.
* @param {Function} funct The function that was executed when the event is triggered.
* @param {Boolean} evtCapturing True if event capturing was done, false otherwise.
*/

SNAKE.removeEventListener = (function() {
    if (window.removeEventListener) {
        return function(obj, event, funct, evtCapturing) {
            obj.removeEventListener(event, funct, evtCapturing);
        };
    } else if (window.detachEvent) {
        return function(obj, event, funct) {
            obj.detachEvent("on" + event, funct);
        };
    }
})();

/**
* This class manages the snake which will reside inside of a SNAKE.Board object.
* @class Snake
* @constructor
* @namespace SNAKE
* @param {Object} config The configuration object for the class. Contains playingBoard (the SNAKE.Board that this snake resides in), startRow and startCol.
*/
SNAKE.Snake = SNAKE.Snake || (function() {
    
    // -------------------------------------------------------------------------
    // Private static variables and methods
    // -------------------------------------------------------------------------
    
    var instanceNumber = 0;
    var blockPool = [];
    
    var SnakeBlock = function() {
        this.elm = null;
        this.elmStyle = null;
        this.row = -1;
        this.col = -1;
        this.xPos = -1000;
        this.yPos = -1000;
        this.next = null;
        this.prev = null;
    };
    
    // this function is adapted from the example at http://greengeckodesign.com/blog/2007/07/get-highest-z-index-in-javascript.html
    function getNextHighestZIndex(myObj) {
        var highestIndex = 0,
            currentIndex = 0,
            ii;
        for (ii in myObj) {
            if (myObj[ii].elm.currentStyle){  
                currentIndex = parseFloat(myObj[ii].elm.style["z-index"],10);
            }else if(window.getComputedStyle) {
                currentIndex = parseFloat(document.defaultView.getComputedStyle(myObj[ii].elm,null).getPropertyValue("z-index"),10);  
            }
            if(!isNaN(currentIndex) && currentIndex > highestIndex){
                highestIndex = currentIndex;
            }
        }
        return(highestIndex+1);  
    }
    
    // -------------------------------------------------------------------------
    // Contructor + public and private definitions
    // -------------------------------------------------------------------------
    
    /*
        config options:
            playingBoard - the SnakeBoard that this snake belongs too.
            startRow - The row the snake should start on.
            startCol - The column the snake should start on.
    */
    
    return function (config) {
    
        if (!config||!config.playingBoard) {return;}
    
        // ----- private variables -----
        
        var me = this,
            playingBoard = config.playingBoard,
            myId = instanceNumber++,
            moveQueue = [], // a queue that holds the next moves of the snake
            currentDirection = 4, // 0: up, 1: left, 2: down, 3: right
            columnShift = [0, 1, 0, -1],
            rowShift = [-1, 0, 1, 0],
            xPosShift = [],
            yPosShift = [],
            isDead = false,
            isPaused = false;
        
        // ----- public variables -----

        me.snakeBody = {};
        me.snakeBody["b0"] = new SnakeBlock(); // create snake head
        me.snakeBody["b0"].row = config.startRow || 1;
        me.snakeBody["b0"].col = config.startCol || 1;
        me.snakeBody["b0"].xPos = me.snakeBody["b0"].row * playingBoard.getBlockWidth();
        me.snakeBody["b0"].yPos = me.snakeBody["b0"].col * playingBoard.getBlockHeight();
        me.snakeBody["b0"].elm = createSnakeElement();
        me.snakeBody["b0"].elmStyle = me.snakeBody["b0"].elm.style;
        playingBoard.getBoardContainer().appendChild( me.snakeBody["b0"].elm );
        me.snakeBody["b0"].elm.style.left = me.snakeBody["b0"].xPos + "px";
        me.snakeBody["b0"].elm.style.top = me.snakeBody["b0"].yPos + "px";
        me.snakeBody["b0"].next = me.snakeBody["b0"];
        me.snakeBody["b0"].prev = me.snakeBody["b0"];
        
        me.snakeLength = 1;
        me.snakeHead = me.snakeBody["b0"];
        me.snakeTail = me.snakeBody["b0"];
        me.snakeHead.elm.className = me.snakeHead.elm.className.replace(/\bsnake-snakebody-dead\b/,'');
        //me.snakeHead.elm.className += snake_color;
        
        // ----- private methods -----
        
        function createSnakeElement() {
            var tempNode = document.createElement("div");
            tempNode.className = "snake-snakebody-block";
            tempNode.style.left = "-1000px";
            tempNode.style.top = "-1000px";
            tempNode.style.width = playingBoard.getBlockWidth() + "px";
            tempNode.style.height = playingBoard.getBlockHeight() + "px";
            return tempNode;
        }
        
        function createBlocks(num) {
            var tempBlock;
            var tempNode = createSnakeElement();

            for (var ii = 1; ii < num; ii++){
                tempBlock = new SnakeBlock();
                tempBlock.elm = tempNode.cloneNode(true);
                tempBlock.elmStyle = tempBlock.elm.style;
                playingBoard.getBoardContainer().appendChild( tempBlock.elm );
                blockPool[blockPool.length] = tempBlock;
            }
            
            tempBlock = new SnakeBlock();
            tempBlock.elm = tempNode;
            playingBoard.getBoardContainer().appendChild( tempBlock.elm );
            blockPool[blockPool.length] = tempBlock;
        }
        
        // ----- public methods -----
        
        me.setPaused = function(val) {
            isPaused = val;
        };
        me.getPaused = function() {
            return isPaused;
        };
        
        /**
        * This method is called when a user presses a key. It logs arrow key presses in "moveQueue", which is used when the snake needs to make its next move.
        * @method handleArrowKeys
        * @param {Number} keyNum A number representing the key that was pressed.
        */
        /*
            Handles what happens when an arrow key is pressed. 
            Direction explained (0 = up, etc etc)
                    0
                  3   1
                    2
        */
        me.handleArrowKeys = function(keyNum) {
            if (isS1Dead || isPaused) {return;}
            
            var snakeLength = me.snakeLength;
            var lastMove = moveQueue[0] || currentDirection;
            //console.log("lastmove="+lastMove);
            //console.log("dir="+keyNum);
            
            switch (keyNum) {
                case 37:
                //case 65:
                    if ( lastMove !== 1 || snakeLength === 1 ) {
                        moveQueue.unshift(3); //SnakeDirection = 3;
                    }
                    break;    
                case 38:
                //case 87:
                    if ( lastMove !== 2 || snakeLength === 1 ) {
                        moveQueue.unshift(0);//SnakeDirection = 0;
                    }
                    break;    
                case 39:
                //case 68:
                    if ( lastMove !== 3 || snakeLength === 1 ) {
                        moveQueue.unshift(1); //SnakeDirection = 1;
                    }
                    break;    
                case 40:
                //case 83:
                    if ( lastMove !== 0 || snakeLength === 1 ) {
                        moveQueue.unshift(2);//SnakeDirection = 2;
                    }
                    break;  
            }
        };
        
        /**
        * This method is executed for each move of the snake. It determines where the snake will go and what will happen to it. This method needs to run quickly.
        * @method go
        */
        me.go = function() {
            console.log("go");
            var oldHead = me.snakeHead,
                newHead = me.snakeTail,
                myDirection = currentDirection,
                grid = playingBoard.grid; // cache grid for quicker lookup
        
            if (isPaused === true) {
                setTimeout(function(){me.go();}, snakeSpeed);
                return;
            }
            if (isS2Dead) {
                me.handleWin();
                return
            }
            me.snakeTail = newHead.prev;
            me.snakeHead = newHead;
        
            // clear the old board position
            if ( grid[newHead.row] && grid[newHead.row][newHead.col] ) {
                grid[newHead.row][newHead.col] = 0;
            }
            if (moveQueue.length) {
                console.log(moveQueue);
                myDirection = currentDirection = moveQueue.pop();
            }
            if (currentDirection !== 4) {
                

                newHead.col = oldHead.col + columnShift[myDirection];
                newHead.row = oldHead.row + rowShift[myDirection];
                newHead.xPos = oldHead.xPos + xPosShift[myDirection];
                newHead.yPos = oldHead.yPos + yPosShift[myDirection];

                if (!newHead.elmStyle) {
                    newHead.elmStyle = newHead.elm.style;
                }

                newHead.elmStyle.left = newHead.xPos + "px";
                newHead.elmStyle.top = newHead.yPos + "px";
                // check the new spot the snake moved into
                if (grid[newHead.row][newHead.col] === 0) {
                    grid[newHead.row][newHead.col] = 1;
                    setTimeout(function () { me.go(); }, snakeSpeed);

                } else if (grid[newHead.row][newHead.col] > 0) {
                    me.handleDeath();
                } else if (grid[newHead.row][newHead.col] === playingBoard.getGridFoodValue()) {
                    grid[newHead.row][newHead.col] = 1;
                    me.eatFood();
                    setTimeout(function () { me.go(); }, snakeSpeed);
                } else if (grid[newHead.row][newHead.col] === playingBoard.getGridObstValue()) {
                    me.handleDeath();
                }
            } else {
                
                setTimeout(function () { me.go(); }, snakeSpeed);
            }
            

            
        };
        
        /**
        * This method is called when it is determined that the snake has eaten some food.
        * @method eatFood
        */
        me.eatFood = function() {
            if (blockPool.length <= growthIncr) {
                createBlocks(growthIncr);//*2
            }
            var blocks = blockPool.splice(0, growthIncr);
            
            var ii = blocks.length,
                index,
                prevNode = me.snakeTail;
            while (ii--) {
                index = "b" + me.snakeLength++;
                me.snakeBody[index] = blocks[ii];
                me.snakeBody[index].prev = prevNode;
                me.snakeBody[index].elm.className = me.snakeHead.elm.className.replace(/\bsnake-snakebody-dead\b/,'')
                //me.snakeBody[index].elm.className += snake_color;
                prevNode.next = me.snakeBody[index];
                prevNode = me.snakeBody[index];
            }
            me.snakeTail = me.snakeBody[index];
            me.snakeTail.next = me.snakeHead;
            me.snakeHead.prev = me.snakeTail;

            playingBoard.foodEaten();
        };
        
        /**
        * This method handles what happens when the snake dies.
        * @method handleDeath
        */
        me.handleDeath = function() {
            me.snakeHead.elm.style.zIndex = getNextHighestZIndex(me.snakeBody);
            me.snakeHead.elm.className = me.snakeHead.elm.className.replace(/\bsnake-snakebody-alive\b/,'')
            me.snakeHead.elm.className += " snake-snakebody-dead";

            isS1Dead = true;
            playingBoard.handleDeath();
            moveQueue.length = 0;
            currentDirection = 4;
        };

        me.handleWin = function () {
            winner = 1;
            me.snakeHead.elm.style.zIndex = getNextHighestZIndex(me.snakeBody);
            me.snakeHead.elm.className = me.snakeHead.elm.className.replace(/\bsnake-snakebody-alive\b/, '')
            me.snakeHead.elm.className += " snake-snakebody-win";

            isS1Dead = true;
            playingBoard.handleDeath();
            moveQueue.length = 0;
            currentDirection = 4;
            
            console.log("S1 wins");
        };
        /**
        * This method sets a flag that lets the snake be alive again.
        * @method rebirth
        */   
        me.rebirth = function() {
            isS1Dead = false;
        };
        
        /**
        * This method reset the snake so it is ready for a new game.
        * @method reset
        */        
        me.reset = function() {
            if (isS1Dead === false) {return;}
            
            var blocks = [],
                curNode = me.snakeHead.next,
                nextNode;
            while (curNode !== me.snakeHead) {
                nextNode = curNode.next;
                curNode.prev = null;
                curNode.next = null;
                blocks.push(curNode);
                curNode = nextNode;
            }
            me.snakeHead.next = me.snakeHead;
            me.snakeHead.prev = me.snakeHead;
            me.snakeTail = me.snakeHead;
            me.snakeLength = 1;
            
            for (var ii = 0; ii < blocks.length; ii++) {
                blocks[ii].elm.remove();
            }
            
            //blockPool.concat(blocks);
            me.snakeHead.elm.className = me.snakeHead.elm.className.replace(/\bsnake-snakebody-dead\b/, '')
            changeSnakeColor(currentColor);
            //me.snakeHead.elm.className += snake_color;
            me.snakeHead.row = config.startRow || 1;
            me.snakeHead.col = config.startCol || 1;
            me.snakeHead.xPos = me.snakeHead.row * playingBoard.getBlockWidth();
            me.snakeHead.yPos = me.snakeHead.col * playingBoard.getBlockHeight();
            me.snakeHead.elm.style.left = me.snakeHead.xPos + "px";
            me.snakeHead.elm.style.top = me.snakeHead.yPos + "px";
            if (currentColor == "orangered") {
                changeSnakeColor("orangered");
            }
            
        };
        
        // ---------------------------------------------------------------------
        // Initialize
        // ---------------------------------------------------------------------
        
        //createBlocks(growthIncr);//*2
        xPosShift[0] = 0;
        xPosShift[1] = playingBoard.getBlockWidth();
        xPosShift[2] = 0;
        xPosShift[3] = -1 * playingBoard.getBlockWidth();
        
        yPosShift[0] = -1 * playingBoard.getBlockHeight();
        yPosShift[1] = 0;
        yPosShift[2] = playingBoard.getBlockHeight();
        yPosShift[3] = 0;
    };
})();





SNAKE.Snake2 = SNAKE.Snake2 || (function () {

    // -------------------------------------------------------------------------
    // Private static variables and methods
    // -------------------------------------------------------------------------

    var instanceNumber = 0;
    var blockPool = [];
    var SnakeBlock = function () {
        this.elm = null;
        this.elmStyle = null;
        this.row = -1;
        this.col = -1;
        this.xPos = -1000;
        this.yPos = -1000;
        this.next = null;
        this.prev = null;
    };

    // this function is adapted from the example at http://greengeckodesign.com/blog/2007/07/get-highest-z-index-in-javascript.html
    function getNextHighestZIndex(myObj) {
        var highestIndex = 0,
            currentIndex = 0,
            ii;
        for (ii in myObj) {
            if (myObj[ii].elm.currentStyle) {
                currentIndex = parseFloat(myObj[ii].elm.style["z-index"], 10);
            } else if (window.getComputedStyle) {
                currentIndex = parseFloat(document.defaultView.getComputedStyle(myObj[ii].elm, null).getPropertyValue("z-index"), 10);
            }
            if (!isNaN(currentIndex) && currentIndex > highestIndex) {
                highestIndex = currentIndex;
            }
        }
        return (highestIndex + 1);
    }

    // -------------------------------------------------------------------------
    // Contructor + public and private definitions
    // -------------------------------------------------------------------------

    /*
        config options:
            playingBoard - the SnakeBoard that this snake belongs too.
            startRow - The row the snake should start on.
            startCol - The column the snake should start on.
    */

    return function (config) {

        if (!config || !config.playingBoard) { return; }
        
        // ----- private variables -----

        var me = this,
            playingBoard = config.playingBoard,
            myId = instanceNumber++,
            moveQueue2 = [], // a queue that holds the next moves of the snake
            currentDirection = 4, // 0: up, 1: left, 2: down, 3: right
            columnShift = [0, 1, 0, -1],
            rowShift = [-1, 0, 1, 0],
            xPosShift = [],
            yPosShift = [],
            isDead = false,
            isPaused = false;

        // ----- public variables -----

        me.snakeBody2 = {};
        me.snakeBody2["b0"] = new SnakeBlock(); // create snake head
        me.snakeBody2["b0"].row = config.startRow2 || 10;
        me.snakeBody2["b0"].col = config.startCol2 || 10;
        me.snakeBody2["b0"].xPos = me.snakeBody2["b0"].row * playingBoard.getBlockWidth();
        me.snakeBody2["b0"].yPos = me.snakeBody2["b0"].col * playingBoard.getBlockHeight();
        me.snakeBody2["b0"].elm = createSnakeElement();
        me.snakeBody2["b0"].elmStyle = me.snakeBody2["b0"].elm.style;
        playingBoard.getBoardContainer().appendChild(me.snakeBody2["b0"].elm);
        me.snakeBody2["b0"].elm.style.left = me.snakeBody2["b0"].xPos + "px";
        me.snakeBody2["b0"].elm.style.top = me.snakeBody2["b0"].yPos + "px";
        me.snakeBody2["b0"].next = me.snakeBody2["b0"];
        me.snakeBody2["b0"].prev = me.snakeBody2["b0"];

        me.snakeLength2 = 1;
        me.snakeHead2 = me.snakeBody2["b0"];
        me.snakeTail2 = me.snakeBody2["b0"];
        me.snakeHead2.elm.className = me.snakeHead2.elm.className.replace(/\bsnake-snakebody-dead\b/, '');
        // ----- private methods -----

        function createSnakeElement() {
            var tempNode = document.createElement("div");
            tempNode.className = "snake-snakebody-block";
            tempNode.className += " S2"
            tempNode.style.left = "-1000px";
            tempNode.style.top = "-1000px";
            tempNode.style.width = playingBoard.getBlockWidth() + "px";
            tempNode.style.height = playingBoard.getBlockHeight() + "px";

            return tempNode;
        }

        function createBlocks(num) {
            var tempBlock;
            var tempNode = createSnakeElement();

            for (var ii = 1; ii < num; ii++) {
                tempBlock = new SnakeBlock();
                tempBlock.elm = tempNode.cloneNode(true);
                tempBlock.elmStyle = tempBlock.elm.style;
                playingBoard.getBoardContainer().appendChild(tempBlock.elm);
                blockPool[blockPool.length] = tempBlock;
            }

            tempBlock = new SnakeBlock();
            tempBlock.elm = tempNode;
            playingBoard.getBoardContainer().appendChild(tempBlock.elm);
            blockPool[blockPool.length] = tempBlock;
        }

        // ----- public methods -----

        me.setPaused = function (val) {
            isPaused = val;
        };
        me.getPaused = function () {
            return isPaused;
        };

        /**
        * This method is called when a user presses a key. It logs arrow key presses in "moveQueue", which is used when the snake needs to make its next move.
        * @method handleArrowKeys
        * @param {Number} keyNum A number representing the key that was pressed.
        */
        /*
            Handles what happens when an arrow key is pressed. 
            Direction explained (0 = up, etc etc)
                    0
                  3   1
                    2
        */
        me.handleArrowKeys2 = function (keyNum) {
            if (isS2Dead || isPaused) { return; }

            var snakeLength = me.snakeLength2;
            var lastMove = moveQueue2[0] || currentDirection;

            //console.log("lastmove="+lastMove);
            //console.log("dir="+keyNum);

            switch (keyNum) {
                case 65:
                    if (lastMove !== 1 || snakeLength === 1) {
                        moveQueue2.unshift(3); //SnakeDirection = 3;
                    }
                    break;
                case 87:
                    if (lastMove !== 2 || snakeLength === 1) {
                        moveQueue2.unshift(0);//SnakeDirection = 0;
                    }
                    break;
                case 68:
                    if (lastMove !== 3 || snakeLength === 1) {
                        moveQueue2.unshift(1); //SnakeDirection = 1;
                    }
                    break;
                case 83:
                    if (lastMove !== 0 || snakeLength === 1) {
                        moveQueue2.unshift(2);//SnakeDirection = 2;
                    }
                    break;
            }
        };

        /**
        * This method is executed for each move of the snake. It determines where the snake will go and what will happen to it. This method needs to run quickly.
        * @method go
        */
        me.go2 = function () {
            console.log("go2");
            var oldHead = me.snakeHead2,
                newHead = me.snakeTail2,
                myDirection = currentDirection,
                grid = playingBoard.grid; // cache grid for quicker lookup

            if (isPaused === true) {
                setTimeout(function () { me.go2(); }, snakeSpeed);
                return;
            }
            if (isS1Dead) {
                me.handleWin2();
                return;
            }
            me.snakeTail2 = newHead.prev;
            me.snakeHead2 = newHead;

            // clear the old board position
            if (grid[newHead.row] && grid[newHead.row][newHead.col]) {
                grid[newHead.row][newHead.col] = 0;
            }

            if (moveQueue2.length) {
                myDirection = currentDirection = moveQueue2.pop();
            }
            if (currentDirection !== 4) {
                
                newHead.col = oldHead.col + columnShift[myDirection];
                newHead.row = oldHead.row + rowShift[myDirection];
                newHead.xPos = oldHead.xPos + xPosShift[myDirection];
                newHead.yPos = oldHead.yPos + yPosShift[myDirection];

                if (!newHead.elmStyle) {
                    newHead.elmStyle = newHead.elm.style;
                }

                newHead.elmStyle.left = newHead.xPos + "px";
                newHead.elmStyle.top = newHead.yPos + "px";

                // check the new spot the snake moved into
                if (grid[newHead.row][newHead.col] === 0) {
                    grid[newHead.row][newHead.col] = 1;
                    setTimeout(function () { me.go2(); }, snakeSpeed);

                } else if (grid[newHead.row][newHead.col] > 0) {
                    me.handleDeath2();
                } else if (grid[newHead.row][newHead.col] === playingBoard.getGridFoodValue()) {
                    grid[newHead.row][newHead.col] = 1;
                    me.eatFood2();
                    setTimeout(function () { me.go2(); }, snakeSpeed);
                } else if (grid[newHead.row][newHead.col] === playingBoard.getGridObstValue()) {
                    me.handleDeath2();
                }
            } else {
                setTimeout(function () { me.go2(); }, snakeSpeed);
            }
            
        };

        /**
        * This method is called when it is determined that the snake has eaten some food.
        * @method eatFood
        */
        me.eatFood2 = function () {
            if (blockPool.length <= growthIncr) {
                createBlocks(growthIncr);//*2
            }
            var blocks = blockPool.splice(0, growthIncr);

            var ii = blocks.length,
                index,
                prevNode = me.snakeTail2;
            while (ii--) {
                index = "b" + me.snakeLength2++;
                me.snakeBody2[index] = blocks[ii];
                me.snakeBody2[index].prev = prevNode;
                me.snakeBody2[index].elm.className = me.snakeHead2.elm.className.replace(/\bsnake-snakebody-dead\b/, '')
                //me.snakeBody[index].elm.className += snake_color;
                prevNode.next = me.snakeBody2[index];
                prevNode = me.snakeBody2[index];
            }
            me.snakeTail2 = me.snakeBody2[index];
            me.snakeTail2.next = me.snakeHead2;
            me.snakeHead2.prev = me.snakeTail2;

            playingBoard.foodEaten();
        };

        /**
        * This method handles what happens when the snake dies.
        * @method handleDeath
        */
        me.handleDeath2 = function () {
            me.snakeHead2.elm.style.zIndex = getNextHighestZIndex(me.snakeBody2);
            me.snakeHead2.elm.className = me.snakeHead2.elm.className.replace(/\bsnake-snakebody-alive\b/, '')
            me.snakeHead2.elm.className += " snake-snakebody-dead";
            isS2Dead = true;
            playingBoard.handleDeath();
            moveQueue2.length = 0;
            currentDirection = 4;
        };

        me.handleWin2 = function () {
            winner = 2;
            me.snakeHead2.elm.style.zIndex = getNextHighestZIndex(me.snakeBody2);
            me.snakeHead2.elm.className = me.snakeHead2.elm.className.replace(/\bsnake-snakebody-alive\b/, '')
            me.snakeHead2.elm.className += " snake-snakebody-win";
            isS2Dead = true;
            playingBoard.handleDeath();
            moveQueue2.length = 0;
            currentDirection = 4;
            
            console.log("S2 wins");
        }

        /**
        * This method sets a flag that lets the snake be alive again.
        * @method rebirth
        */
        me.rebirth2 = function () {
            isS2Dead = false;
        };

        /**
        * This method reset the snake so it is ready for a new game.
        * @method reset
        */
        me.reset2 = function () {
            if (isS2Dead === false) { return; }

            var blocks = [],
                curNode = me.snakeHead2.next,
                nextNode;
            while (curNode !== me.snakeHead2) {
                nextNode = curNode.next;
                curNode.prev = null;
                curNode.next = null;
                blocks.push(curNode);
                curNode = nextNode;
            }
            me.snakeHead2.next = me.snakeHead2;
            me.snakeHead2.prev = me.snakeHead2;
            me.snakeTail2 = me.snakeHead2;
            me.snakeLength2 = 1;

            for (var ii = 0; ii < blocks.length; ii++) {
                blocks[ii].elm.remove();
            }

            //blockPool.concat(blocks);
            me.snakeHead2.elm.className = me.snakeHead2.elm.className.replace(/\bsnake-snakebody-dead\b/, '')
            //changeSnakeColor(currentColor);
            //me.snakeHead.elm.className += snake_color;
            me.snakeHead2.row = config.startRow2 || 10;
            me.snakeHead2.col = config.startCol2 || 10;
            me.snakeHead2.xPos = me.snakeHead2.row * playingBoard.getBlockWidth();
            me.snakeHead2.yPos = me.snakeHead2.col * playingBoard.getBlockHeight();
            me.snakeHead2.elm.style.left = me.snakeHead2.xPos + "px";
            me.snakeHead2.elm.style.top = me.snakeHead2.yPos + "px";
            
            if (currentColor == "orangered") {
                changeSnakeColor("orangered");
            }
        };

        // ---------------------------------------------------------------------
        // Initialize
        // ---------------------------------------------------------------------

        //createBlocks(growthIncr);//*2
        xPosShift[0] = 0;
        xPosShift[1] = playingBoard.getBlockWidth();
        xPosShift[2] = 0;
        xPosShift[3] = -1 * playingBoard.getBlockWidth();

        yPosShift[0] = -1 * playingBoard.getBlockHeight();
        yPosShift[1] = 0;
        yPosShift[2] = playingBoard.getBlockHeight();
        yPosShift[3] = 0;
    };
})();

/**
* This class manages the food which the snake will eat.
* @class Food
* @constructor
* @namespace SNAKE
* @param {Object} config The configuration object for the class. Contains playingBoard (the SNAKE.Board that this food resides in).
*/

SNAKE.Food = SNAKE.Food || (function() {
    
    // -------------------------------------------------------------------------
    // Private static variables and methods
    // -------------------------------------------------------------------------
    
    var instanceNumber = 0;
    
    function getRandomPosition(x, y){
        return Math.floor(Math.random()*(y+1-x)) + x; 
    }
    
    // -------------------------------------------------------------------------
    // Contructor + public and private definitions
    // -------------------------------------------------------------------------
    
    /*
        config options:
            playingBoard - the SnakeBoard that this object belongs too.
    */
    return function(config) {
        
        if (!config||!config.playingBoard) {return;}

        // ----- private variables -----

        var me = this;
        var playingBoard = config.playingBoard;
        var fRow, fColumn;
        var myId = instanceNumber++;

        var elmFood = document.createElement("div");
        elmFood.setAttribute("id", "snake-food-"+myId);
        elmFood.className = "snake-food-block";
        elmFood.style.width = playingBoard.getBlockWidth() + "px";
        elmFood.style.height = playingBoard.getBlockHeight() + "px";
        elmFood.style.left = "-1000px";
        elmFood.style.top = "-1000px";
        playingBoard.getBoardContainer().appendChild(elmFood);
        
        // ----- public methods -----
        
        /**
        * @method getFoodElement
        * @return {DOM Element} The div the represents the food.
        */        
        me.getFoodElement = function() {
            return elmFood;  
        };
        
        /**
        * Randomly places the food onto an available location on the playing board.
        * @method randomlyPlaceFood
        */    
        me.randomlyPlaceFood = function() {
            // if there exist some food, clear its presence from the board
            if (playingBoard.grid[fRow] && playingBoard.grid[fRow][fColumn] === playingBoard.getGridFoodValue()){
                playingBoard.grid[fRow][fColumn] = 0; 
            }

            var row = 0, col = 0, numTries = 0;

            var maxRows = playingBoard.grid.length-1;
            var maxCols = playingBoard.grid[0].length-1;
            
            while (playingBoard.grid[row][col] !== 0){
                row = getRandomPosition(1, maxRows);
                col = getRandomPosition(1, maxCols);

                // in some cases there may not be any room to put food anywhere
                // instead of freezing, exit out
                numTries++;
                if (numTries > 20000){
                    row = -1;
                    col = -1;
                    break; 
                } 
            }

            playingBoard.grid[row][col] = playingBoard.getGridFoodValue();
            fRow = row;
            fColumn = col;
            elmFood.style.top = row * playingBoard.getBlockHeight() + "px";
            elmFood.style.left = col * playingBoard.getBlockWidth() + "px";
        };
    };
})();

SNAKE.Obstacle = SNAKE.Obstacle || (function () {

    // -------------------------------------------------------------------------
    // Private static variables and methods
    // -------------------------------------------------------------------------

    var instanceNumber = 0;

    function getRandomPosition(x, y) {
        return Math.floor(Math.random() * (y + 1 - x)) + x;
    }

    // -------------------------------------------------------------------------
    // Contructor + public and private definitions
    // -------------------------------------------------------------------------

    /*
        config options:
            playingBoard - the SnakeBoard that this object belongs too.
    */
    return function (config) {

        if (!config || !config.playingBoard) { return; }

        // ----- private variables -----

        var me = this;
        var playingBoard = config.playingBoard;
        var fRow, fColumn;
        var myId = instanceNumber++;
        // ----- public methods -----


        /**
        * Randomly places the obstacle onto an available location on the playing board.
        * @method randomlyPlaceFood
        */
        me.randomlyPlaceObstacle = function () {
            var elmObst = document.createElement("div");
            elmObst.setAttribute("class", "snake-obstacle");
            //elmFood.className = "snake-food-block";
            elmObst.style.width = playingBoard.getBlockWidth() + "px";
            elmObst.style.height = playingBoard.getBlockHeight() + "px";
            elmObst.style.left = "-1000px";
            elmObst.style.top = "-1000px";
            playingBoard.getBoardContainer().appendChild(elmObst);
            var row = 0, col = 0, numTries = 0;

            var maxRows = playingBoard.grid.length - 1;
            var maxCols = playingBoard.grid[0].length - 1;

            while (playingBoard.grid[row][col] !== 0) {
                row = getRandomPosition(1, maxRows);
                col = getRandomPosition(1, maxCols);

                // in some cases there may not be any room to put food anywhere
                // instead of freezing, exit out
                numTries++;
                if (numTries > 20000) {
                    row = -1;
                    col = -1;
                    break;
                }
            }

            playingBoard.grid[row][col] = playingBoard.getGridObstValue();
            fRow = row;
            fColumn = col;
            elmObst.style.top = row * playingBoard.getBlockHeight() + "px";
            elmObst.style.left = col * playingBoard.getBlockWidth() + "px";
        };
    };
})();

/**
* This class manages playing board for the game.
* @class Board
* @constructor
* @namespace SNAKE
* @param {Object} config The configuration object for the class. Set fullScreen equal to true if you want the game to take up the full screen, otherwise, set the top, left, width and height parameters.
*/

SNAKE.Board = SNAKE.Board || (function() {

    // -------------------------------------------------------------------------
    // Private static variables and methods
    // -------------------------------------------------------------------------

    var instanceNumber = 0;
    // this function is adapted from the example at http://greengeckodesign.com/blog/2007/07/get-highest-z-index-in-javascript.html
    function getNextHighestZIndex(myObj) {
        var highestIndex = 0,
            currentIndex = 0,
            ii;
        for (ii in myObj) {
            if (myObj[ii].elm.currentStyle){  
                currentIndex = parseFloat(myObj[ii].elm.style["z-index"],10);
            }else if(window.getComputedStyle) {
                currentIndex = parseFloat(document.defaultView.getComputedStyle(myObj[ii].elm,null).getPropertyValue("z-index"),10);  
            }
            if(!isNaN(currentIndex) && currentIndex > highestIndex){
                highestIndex = currentIndex;
            }
        }
        return(highestIndex+1);  
    }

    /*
        This function returns the width of the available screen real estate that we have
    */
    function getClientWidth(){
        var myWidth = 0;
        if( typeof window.innerWidth === "number" ) {
            myWidth = window.innerWidth;//Non-IE
        } else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
            myWidth = document.documentElement.clientWidth;//IE 6+ in 'standards compliant mode'
        } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
            myWidth = document.body.clientWidth;//IE 4 compatible
        } 
        return myWidth;
    }
    /*
        This function returns the height of the available screen real estate that we have
    */
    function getClientHeight(){
        var myHeight = 0;
        if( typeof window.innerHeight === "number" ) {
            myHeight = window.innerHeight;//Non-IE
        } else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
            myHeight = document.documentElement.clientHeight;//IE 6+ in 'standards compliant mode'
        } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
            myHeight = document.body.clientHeight;//IE 4 compatible
        } 
        return myHeight;
    }

    // -------------------------------------------------------------------------
    // Contructor + public and private definitions
    // -------------------------------------------------------------------------
    
    return function (inputConfig) {
        
        // --- private variables ---
        var me = this,
            myId = instanceNumber++,
            config = inputConfig || {},
            MAX_BOARD_COLS = 250,
            MAX_BOARD_ROWS = 250,
            blockWidth = 20,
            blockHeight = 20,
            GRID_FOOD_VALUE = -1, // the value of a spot on the board that represents snake food, MUST BE NEGATIVE
            GRID_OBST_VALUE = -2,
            myFood,
            mySnake,
            mySnake2,
            boardState = 1, // 0: in active; 1: awaiting game start; 2: playing game
            myKeyListener,
            isPaused = false,//note: both the board and the snake can be paused
            // Board components
            elmContainer, elmPlayingField, elmAboutPanel, elmLengthPanel, elmWelcome, elmTryAgain, elmPauseScreen;
        
        // --- public variables ---
        me.grid = [];
        
        // ---------------------------------------------------------------------
        // private functions
        // ---------------------------------------------------------------------
        
        function createBoardElements() {
            elmPlayingField = document.createElement("div");
            elmPlayingField.setAttribute("id", "playingField");
            elmPlayingField.className = "snake-playing-field";
            
            SNAKE.addEventListener(elmPlayingField, "click", function() {
                elmContainer.focus();
            }, false);
            
            elmPauseScreen = document.createElement("div");
            elmPauseScreen.className = "snake-pause-screen";
            elmPauseScreen.innerHTML = "<div style='padding:10px;'>[Paused]<p/>Press [space] to unpause.</div>";
            
            elmAboutPanel = document.createElement("div");
            elmAboutPanel.className = "snake-panel-component";
            elmAboutPanel.innerHTML = "<a>made by Sebastian M, original by patorjk </a> - <a href='https://github.com/smonzon14/smonzon14.github.io' class='snake-link'>source code</a> - <a href='http://patorjk.com/games/snake/' class='snake-link'>original game</a>";
            
            elmLengthPanel = document.createElement("div");
            elmLengthPanel.className = "snake-panel-component";
            elmLengthPanel.innerHTML = "Length: 1";
            
            elmWelcome = createWelcomeElement();
            elmTryAgain = createTryAgainElement(1);
            
            SNAKE.addEventListener( elmContainer, "keyup", function(evt) {
                if (!evt) var evt = window.event;
                evt.cancelBubble = true;
                if (evt.stopPropagation) {evt.stopPropagation();}
                if (evt.preventDefault) {evt.preventDefault();}
                return false;
            }, false);
            
            elmContainer.className = "snake-game-container";
            
            elmPauseScreen.style.zIndex = 10000;
            elmContainer.appendChild(elmPauseScreen);
            elmContainer.appendChild(elmPlayingField);
            elmContainer.appendChild(elmAboutPanel);
            elmContainer.appendChild(elmLengthPanel);
            elmContainer.appendChild(elmWelcome);
            elmContainer.appendChild(elmTryAgain);
            
            mySnake = new SNAKE.Snake({ playingBoard: me, startRow: 2, startCol: 2 });
            mySnake2 = new SNAKE.Snake2({ playingBoard: me, startRow2: 10, startCol2: 10 });
            myFood = new SNAKE.Food({ playingBoard: me });
            
            myObstacle = new SNAKE.Obstacle({ playingBoard: me });

            elmWelcome.style.zIndex = 1000;
            changeMode("button0", "yellow");

        }
        function maxBoardWidth() {
            return MAX_BOARD_COLS * me.getBlockWidth();   
        }
        function maxBoardHeight() {
            return MAX_BOARD_ROWS * me.getBlockHeight();
        }
        
        function createWelcomeElement() {
            var tmpElm = document.createElement("div");
            tmpElm.id = "sbWelcome" + myId;
            tmpElm.className = "snake-welcome-dialog";
            
            var welcomeTxt = document.createElement("div");
            var fullScreenText = "";
            if (config.fullScreen) {
                //fullScreenText = "On Windows, press F11 to play in Full Screen mode.";   
            }
            welcomeTxt.innerHTML = "<div id='JSSWelcomeTitle' class='JSSTitle'><strong>JAVASCRIPT SNAKE</strong></div><p></p>Use the <font color='#ffffff'><strong>ARROW KEYS</strong></font> to play the game. " + fullScreenText + "<p></p>"; //or <font color='#ffffff'><strong>WASD</strong></font>
            var welcomeStart = document.createElement("button");
            welcomeStart.id = "welcomeButton"
            welcomeStart.innerHTML ="<strong>PLAY</strong>"
            
            var loadGame = function() {
                SNAKE.removeEventListener(window, "keyup", kbShortcut, false);
                tmpElm.style.display = "none";
                me.setBoardState(1);
                me.getBoardContainer().focus();
            };
            
            var kbShortcut = function(evt) {
                if (!evt) var evt = window.event;
                var keyNum = (evt.which) ? evt.which : evt.keyCode;
                if (keyNum === 32 || keyNum === 13) {
                    loadGame();
                }
            };
            SNAKE.addEventListener(window, "keyup", kbShortcut, false);
            SNAKE.addEventListener(welcomeStart, "click", loadGame, false);
            
            tmpElm.appendChild(welcomeTxt);
            tmpElm.appendChild(welcomeStart);
            
            return tmpElm;
        }
        
        function createTryAgainElement(score) {
            var tmpElm = document.createElement("div");
            tmpElm.id = "sbTryAgain" + myId;
            tmpElm.className = "snake-try-again-dialog";
            
            var tryAgainTxt = document.createElement("div");
            tryAgainTxt.id = "sbTryAgainMessage";
            
            var tryAgainStart = document.createElement("button");
            tryAgainStart.id = "tryAgainButton";
            tryAgainStart.innerHTML = "<strong>PLAY AGAIN</strong>"
            
            var reloadGame = function() {
                tmpElm.style.display = "none"; 
                me.resetBoard();
                me.setBoardState(1);
                me.getBoardContainer().focus();
            };
            
            var kbTryAgainShortcut = function(evt) {
                if (boardState !== 0 || tmpElm.style.display !== "block") {return;}
                if (!evt) var evt = window.event;
                var keyNum = (evt.which) ? evt.which : evt.keyCode;
                if (keyNum === 32 || keyNum === 13) {
                    reloadGame();
                }
            };
            SNAKE.addEventListener(window, "keyup", kbTryAgainShortcut, true);
            
            SNAKE.addEventListener(tryAgainStart, "click", reloadGame, false);
            tmpElm.appendChild(tryAgainTxt);
            tmpElm.appendChild(tryAgainStart);
            return tmpElm;
        }
        
        // ---------------------------------------------------------------------
        // public functions
        // ---------------------------------------------------------------------
        
        me.setPaused = function(val) {
            isPaused = val;
            mySnake.setPaused(val);
            if (currentColor == "orangered") {
                mySnake2.setPaused(val);
            }
            if (isPaused) {
                elmPauseScreen.style.display = "block";
            } else {
                elmPauseScreen.style.display = "none";
            }
        };
        me.getPaused = function() {
            return isPaused;
        };
        
        /**
        * Resets the playing board for a new game.
        * @method resetBoard
        */   
        me.resetBoard = function() {
            SNAKE.removeEventListener(elmContainer, "keydown", myKeyListener, false);
            mySnake.reset();
            if (currentColor == "orangered") {
                mySnake2.reset2();
                
            }
            elmLengthPanel.innerHTML = "Length: 1";
            me.setupPlayingField();
            removeObst();
        };
        /**
        * Gets the current state of the playing board. There are 3 states: 0 - Welcome or Try Again dialog is present. 1 - User has pressed "Start Game" on the Welcome or Try Again dialog but has not pressed an arrow key to move the snake. 2 - The game is in progress and the snake is moving.
        * @method getBoardState
        * @return {Number} The state of the board.
        */  
        me.getBoardState = function() {
            return boardState;
        };
        /**
        * Sets the current state of the playing board. There are 3 states: 0 - Welcome or Try Again dialog is present. 1 - User has pressed "Start Game" on the Welcome or Try Again dialog but has not pressed an arrow key to move the snake. 2 - The game is in progress and the snake is moving.
        * @method setBoardState
        * @param {Number} state The state of the board.
        */  
        me.setBoardState = function(state) {
            boardState = state;
        };
        /**
        * @method getGridFoodValue
        * @return {Number} A number that represents food on a number representation of the playing board.
        */  
        me.getGridFoodValue = function() {
            return GRID_FOOD_VALUE;
        };



        me.getGridObstValue = function () {
            return GRID_OBST_VALUE;
        };
        /**
        * @method getPlayingFieldElement
        * @return {DOM Element} The div representing the playing field (this is where the snake can move).
        */ 
        me.getPlayingFieldElement = function() {
            return elmPlayingField;
        };
        /**
        * @method setBoardContainer
        * @param {DOM Element or String} myContainer Sets the container element for the game.
        */ 
        me.setBoardContainer = function(myContainer) {
            if (typeof myContainer === "string") {
                myContainer = document.getElementById(myContainer);   
            }
            if (myContainer === elmContainer) {return;}
            elmContainer = myContainer;
            elmPlayingField = null;
            
            me.setupPlayingField();
        };
        /**
        * @method getBoardContainer
        * @return {DOM Element}
        */ 
        me.getBoardContainer = function() {
            return elmContainer;
        };
        /**
        * @method getBlockWidth
        * @return {Number}
        */ 
        me.getBlockWidth = function() {
            return blockWidth;  
        };
        /**
        * @method getBlockHeight
        * @return {Number}
        */ 
        me.getBlockHeight = function() {
            return blockHeight;  
        };

        me.getColumns = function () {
            var cWidth;
            if (config.fullScreen === true) {
                cWidth = getClientWidth() - 5;
            } else {
                cWidth = config.width;
            }
            var wEdgeSpace = me.getBlockWidth() * 2 + (cWidth % me.getBlockWidth());
            var fWidth = Math.min(maxBoardWidth() - wEdgeSpace, cWidth - wEdgeSpace);
            var numBoardCols = fWidth / me.getBlockWidth() + 2;
            return numBoardCols;
        }
        me.getRows = function () {
            var cHeight;
            if (config.fullScreen === true) {
                cHeight = getClientHeight() - 5;
            } else {
                cHeight = config.height;
            }
            var hEdgeSpace = me.getBlockHeight() * 3 + (cHeight % me.getBlockHeight());
            var fHeight = Math.min(maxBoardHeight() - hEdgeSpace, cHeight - hEdgeSpace);
            var numBoardRows = fHeight / me.getBlockHeight() + 2;
            return numBoardRows;
        }
        /**
        * Sets up the playing field.
        * @method setupPlayingField
        */ 
        me.setupPlayingField = function () {
            
            if (!elmPlayingField) {createBoardElements();} // create playing field

            // calculate width of our game container
            var cWidth, cHeight;
            if (config.fullScreen === true) {
                cTop = 0;
                cLeft = 0;
                cWidth = getClientWidth()-5;
                cHeight = getClientHeight()-5;
                document.body.style.backgroundColor = "#808080";
            } else {
                cTop = config.top;
                cLeft = config.left;
                cWidth = config.width;
                cHeight = config.height;
            }
            
            // define the dimensions of the board and playing field
            var wEdgeSpace = me.getBlockWidth()*2 + (cWidth % me.getBlockWidth());
            var fWidth = Math.min(maxBoardWidth()-wEdgeSpace,cWidth-wEdgeSpace);
            var hEdgeSpace = me.getBlockHeight()*3 + (cHeight % me.getBlockHeight());
            var fHeight = Math.min(maxBoardHeight()-hEdgeSpace,cHeight-hEdgeSpace);
            
            elmContainer.style.left = cLeft + "px";
            elmContainer.style.top = cTop + "px";
            elmContainer.style.width = cWidth + "px";
            elmContainer.style.height = cHeight + "px";
            elmPlayingField.style.left = me.getBlockWidth() + "px";
            elmPlayingField.style.top  = me.getBlockHeight() + "px";
            elmPlayingField.style.width = fWidth + "px";
            elmPlayingField.style.height = fHeight + "px";
            
            // the math for this will need to change depending on font size, padding, etc
            // assuming height of 14 (font size) + 8 (padding)
            var bottomPanelHeight = hEdgeSpace - me.getBlockHeight();
            var pLabelTop = me.getBlockHeight() + fHeight + Math.round((bottomPanelHeight - 30)/2) + "px";
            elmAboutPanel.style.bottom = "-5px";
            //elmAboutPanel.style.top = pLabelTop;
            elmAboutPanel.style.width = "450px";
            elmAboutPanel.style.left = Math.round(cWidth/2) - Math.round(450/2) + "px";
            
            elmLengthPanel.style.bottom = "-5px";
            elmLengthPanel.style.left = cWidth - 120 + "px";
            //elmLengthPanel.style.top = pLabelTop;
            //elmLengthPanel.style.left = cWidth - 120 + "px";
            
            // if width is too narrow, hide the about panel
            if (cWidth < 700) {
                elmAboutPanel.style.display = "none";
            } else {
                elmAboutPanel.style.display = "block";
            }
            
            me.grid = [];
            var numBoardCols = fWidth / me.getBlockWidth() + 2;
            var numBoardRows = fHeight / me.getBlockHeight() + 2;
            
            for (var row = 0; row < numBoardRows; row++) {
                me.grid[row] = [];
                for (var col = 0; col < numBoardCols; col++) {
                    if (col === 0 || row === 0 || col === (numBoardCols-1) || row === (numBoardRows-1)) {
                        me.grid[row][col] = 1; // an edge
                    } else {
                        me.grid[row][col] = 0; // empty space
                    }
                }
            }
            
            myFood.randomlyPlaceFood();
            myFood.randomlyPlaceFood();
            // setup event listeners
            
            myKeyListener = function(evt) {
                if (!evt) var evt = window.event;
                var keyNum = (evt.which) ? evt.which : evt.keyCode;

                if (me.getBoardState() === 1) {
                    if ( !(keyNum >= 37 && keyNum <= 40) && !(keyNum === 87 || keyNum === 65 || keyNum === 83 || keyNum === 68)) {return;} // if not an arrow key, leave
                    if (currentColor !== "orangered" && !(keyNum >= 37 && keyNum <= 40)) { return };
                    // This removes the listener added at the #listenerX line
                    SNAKE.removeEventListener(elmContainer, "keydown", myKeyListener, false);
                    //console.log("removed");
                    myKeyListener = function(evt) {
                        if (!evt) var evt = window.event;
                        var keyNum = (evt.which) ? evt.which : evt.keyCode;
                        
                        //console.log(keyNum);
                        if (keyNum === 32) {
                            me.setPaused(!me.getPaused());
                        }
                        if (keyNum >= 37 && keyNum <= 40){
                            mySnake.handleArrowKeys(keyNum);
                        }
                        else if(currentColor == "orangered"){
                            mySnake2.handleArrowKeys2(keyNum);
                        }
                        
                        evt.cancelBubble = true;
                        if (evt.stopPropagation) {evt.stopPropagation();}
                        if (evt.preventDefault) {evt.preventDefault();}
                        return false;
                    };
                    SNAKE.addEventListener( elmContainer, "keydown", myKeyListener, false);
                    console.log("rebirth");
                    mySnake.rebirth();
                    mySnake2.rebirth2();
                    if (keyNum >= 37 && keyNum <= 40) {
                        mySnake.handleArrowKeys(keyNum);
                    } else if (currentColor == "orangered") {
                        mySnake2.handleArrowKeys2(keyNum);
                    }
                    
                    me.setBoardState(2); // start the game!
                    if (currentColor == "orangered") {
                        mySnake2.go2();
                    }
                    mySnake.go();
                    
                }
                
                evt.cancelBubble = true;
                if (evt.stopPropagation) {evt.stopPropagation();}
                if (evt.preventDefault) {evt.preventDefault();}
                return false;
            };
            SNAKE.removeEventListener(elmContainer, "keydown", myKeyListener, false);
            SNAKE.addEventListener(elmContainer, "keydown", myKeyListener, false);
            
            
            // Search for #listenerX to see where this is removed
            //SNAKE.addEventListener(elmContainer, "keydown", myKeyListener, false);
            
        };
        
        /**
        * This method is called when the snake has eaten some food.
        * @method foodEaten
        */ 
        me.foodEaten = function () {
            if (currentColor !== "orangered") {
                elmLengthPanel.innerHTML = "Length: " + mySnake.snakeLength;
            }
            
            myFood.randomlyPlaceFood();
            if (currentColor === "blue") {
                var numObst = Math.floor((Math.random() * 3) + 1);
                for (i = 0; i < numObst; i++) {
                    myObstacle.randomlyPlaceObstacle();
                }
                snakeSpeed -= 0.3;
            }
            
        };
        
        /**
        * This method is called when the snake dies.
        * @method handleDeath
        */ 
        me.handleDeath = function () {
            if (currentColor == "orangered") {
                document.getElementById("sbTryAgainMessage").innerHTML = "<div class='JSSTitle'><strong>JAVASCRIPT SNAKE</strong></div>Winner: <font color='#ffffff'><strong>Player " + winner + "</strong></font>";
            } else {
                document.getElementById("sbTryAgainMessage").innerHTML = "<div class='JSSTitle'><strong>JAVASCRIPT SNAKE</strong></div>You died <font color='#ffffff'><strong>:) </strong> Score: <strong>" + mySnake.snakeLength + "</strong></font><p></p>";
            }
            var titles = document.getElementsByClassName("JSSTitle"), i, len;

            for (i = 0, len = titles.length; i < len; i++) {
                titles[i].style.color = currentColor;
            }
            if (currentColor === "blue") snakeSpeed = 60;
            var index = Math.max(getNextHighestZIndex(mySnake.snakeBody), getNextHighestZIndex({ tmp: { elm: myFood.getFoodElement() } }));
            elmContainer.removeChild(elmTryAgain);
            elmContainer.appendChild(elmTryAgain);
            elmTryAgain.style.zIndex = index;
            elmTryAgain.style.display = "block";
            me.setBoardState(0);
            
        };
        
        // ---------------------------------------------------------------------
        // Initialize
        // ---------------------------------------------------------------------

        config.fullScreen = (typeof config.fullScreen === "undefined") ? false : config.fullScreen;        
        config.top = (typeof config.top === "undefined") ? 0 : config.top;
        config.left = (typeof config.left === "undefined") ? 0 : config.left;
        config.width = (typeof config.width === "undefined") ? 400 : config.width;        
        config.height = (typeof config.height === "undefined") ? 400 : config.height;
        
        if (config.fullScreen) {
            SNAKE.addEventListener(window,"resize", function() {
                me.setupPlayingField();
            }, false);
        }
        
        me.setBoardState(0);
        
        if (config.boardContainer) {
            me.setBoardContainer(config.boardContainer);
        }
        
    }; // end return function
})();