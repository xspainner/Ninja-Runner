let board;
let boardWidth = 900;
let boardHeight = 400;
let context;
let backgroundImg;

let playerWidth = 85;
let playerHeight = 85;
let playerX = 50;
let playerY = 318;
let playerImg;
let player = {
    x: playerX,
    y: playerY,
    width: playerWidth,
    height: playerHeight
}
let gameOver = false;
let score = 0;
let time = 0;

let boxImg;
let boxWidth = 100;
let boxHeight = 100;
let boxX = 900;
let boxY = 327;

let boxsArray = [];
let boxSpeed = -5 ;

let VelocityY = 0;
let Gravity = 0.25;

window.onload = function() {
    board = document.getElementById('board');
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext('2d');
    
    backgroundImg = new Image();
    backgroundImg.src = "road.jpg"; 

    playerImg = new Image();
    playerImg.src = "ninja.png";

    playerImg.onload = function() {
        context.drawImage(playerImg, player.x, player.y, player.width, player.height);
    }

    requestAnimationFrame(update);

    document.addEventListener("keydown", movePlayer);
    document.addEventListener("mousedown", movePlayer);

    boxImg = new Image();
    boxImg.src = "car.png";
    Timelive();
}

let Timelive = () => {
    let timeInterval = Math.floor(1500 + Math.random() * 3000); 
    console.log("Next box will be created in: " + timeInterval + "ms");

    setTimeout(() => {
        createbox();
        Timelive();
    }, timeInterval);
};

let maxTime = 60;
let lives = 3;

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }

    context.clearRect(0, 0, board.width, board.height); 
    context.drawImage(backgroundImg, 0, 0, board.width, board.height);  

    VelocityY += Gravity;
    player.y = Math.min(player.y + VelocityY, playerY);
    context.drawImage(playerImg, player.x, player.y, player.width, player.height);

    for (let i = 0; i < boxsArray.length; i++) {
        let box = boxsArray[i];
        box.x += boxSpeed;
        context.drawImage(box.img, box.x, box.y, box.width, box.height);

        if (onCollision(player, box)) {
            if (lives > 1) {
                lives--;
                context.font = "bold 40px Arial";
                context.fillStyle = "black";  
                context.textAlign = "center";
                context.fillText("Try again", boardWidth / 2, boardHeight / 2);
                context.font = "bold 30px Arial";
                context.fillText("Final Score: " + score, boardWidth / 2, 260);
                context.fillText("Lives Remaining: " + lives, boardWidth / 2, 290);
                gameOver = true;
                
            } else {
                lives--;
                if (lives === 0) {
                    context.fillStyle = "red";
                    context.font = "bold 40px Arial";
                    context.textAlign = "center";
                    context.fillText("Game Over!!!!!", boardWidth / 2, boardHeight / 2);
                    context.fillText("Score: " + score, boardWidth / 2, 200);
                    gameOver = true;
                   
                }
            }
            return;  
        }
    }


    context.font = "normal bold 20px Arial";
    context.textAlign = "left";
    context.fillStyle = "white";
    context.fillText("Lives : " + lives, 10, 80);
    context.fillStyle = "white";
    context.fillText("Score : " + score, 10, 40);
    
    time += 0.01;
    context.textAlign = "right";
    context.fillStyle = "white";
    context.fillText("Time : " + (time.toFixed(2)), 850, 30);
    

    if (time >= maxTime) {
        gameOver = true;
        context.font = "bold 40px Arial";
        context.fillStyle = "red";  
        context.textAlign = "center";
        context.fillText("Time Up!!!!", boardWidth / 2, boardHeight / 2);
        context.font = "bold 40px Arial";
        context.fillStyle = "red";  
        context.fillText("Score  :" + (score-1), boardWidth / 2, 200);
    }

    score++;
}

function movePlayer(e) {
    if (gameOver) {
        return;
    }
    if (e.code === "Space" && player.y === playerY) {
        VelocityY = -10;
    }
}

function createbox() {
    if (gameOver) {
        return;
    }
    let box = {
        img: boxImg,
        x: boxX,
        y: boxY,
        height: boxHeight,
        width: boxWidth
    }

    boxsArray.push(box);
    if (boxsArray.length > 5) {
        boxsArray.shift();  
    }
}

function onCollision(obj1, obj2) {
    return obj1.x < (obj2.x + obj2.width) &&
           (obj1.x + obj1.width) > obj2.x &&
           obj1.y < (obj2.y + obj2.height) &&
           (obj1.y + obj1.height) > obj2.y;
}

function refreshing() {
    if (gameOver && lives > 0) {
        boxsArray = [];
        score = 0;
        time = 0;
        gameOver = false;
    }
}

function restartGame() {
    if (lives === 0) {
        location.reload();
    }
}
