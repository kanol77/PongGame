const canvas = document.querySelector('.playfield');
const context = canvas.getContext("2d");
const playerScoreField = document.querySelector('.player-score');
const AIScoreField = document.querySelector('.AI-score');

const sfx = {
    hit1: new Howl({
        src: "./hit-sound-1.mp3"
    }
    ),
    hit2: new Howl({
        src: "./hit-sound-2.mp3"
    }
    ),
    score: new Howl({
        src: "./score-sound.mp3"
    }),
    win: new Howl({
        src: "./winning-sound.mp3"
    })

}

canvas.width = 650;
canvas.height = 400;

let controller = {
    'w': {pressed: false, func: movePaddleOneUp},
    's': {pressed: false, func: movePaddleOneDown},
    'ArrowUp': {pressed: false, func: movePaddleTwoUp},
    'ArrowDown': {pressed: false, func: movePaddleTwoDown},
}

window.onload = () => {
    sfx.score.play();
    playerScoreField.innerText = sessionStorage.getItem("PS") || 0;
    AIScoreField.innerText = sessionStorage.getItem("AIS") || 0; 
}
window.addEventListener("keydown", (e) => {
    if(controller[e.key]){
      controller[e.key].pressed = true;
    }
  });
window.addEventListener("keyup", (e) => {
    if(controller[e.key]){
      controller[e.key].pressed = false;
    }
  });

const executeMoves = () => {
    Object.keys(controller).forEach(key=> {
        controller[key].pressed && controller[key].func()
})
}

function movePaddleOneUp(){
    if(playerPaddle.y - playerPaddle.gravity > 0){
        playerPaddle.y -= playerPaddle.gravity * 1;
    }
}

function movePaddleOneDown(){
    if(playerPaddle.y + playerPaddle.gravity + 60 < canvas.height){
        playerPaddle.y += playerPaddle.gravity * 1;
    }
}

function movePaddleTwoUp(){
    if(AIPaddle.y - AIPaddle.gravity > 0){
        AIPaddle.y -= AIPaddle.gravity * 1;
    }
}

function movePaddleTwoDown(){
    if(AIPaddle.y + AIPaddle.gravity + 60 < canvas.height){
        AIPaddle.y += AIPaddle.gravity * 1;
    }
}

class Element{
    constructor(options){
        this.x = options.x,
        this.y = options.y,
        this.width = options.width,
        this.height = options.height,
        this.color = options.color,
        this.speed = options.speed || 2,
        this.gravity = options.gravity
    }
};

const playerPaddle = new Element({
    x: 10,
    y: 150,
    width: 10,
    height: 70,
    color: "white",
    gravity: 2,
});

const AIPaddle = new Element({
    x: 630,
    y: 150,
    width: 10,
    height: 70,
    color: "white",
    gravity: 2,
});

const ball = new Element({
    x: 650/2,
    y: 165,
    width: 10,
    height: 15,
    color: "white",
    speed: 1,
    gravity: 1,
});

function drawElement(element){
    context.fillStyle = element.color;
    context.fillRect(element.x, element.y, element.width, element.height);
}

function drawBall(element){
    context.beginPath();
    context.arc(element.x, element.y, element.width-1, 0, Math.PI*2);
    context.fillStyle = element.color;
    context.fill();
    context.closePath();
}

function drawElements(){
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawElement(playerPaddle);
    drawElement(AIPaddle);
    drawElement(ball);
    //drawBall(ball); //-If you want a round ball uncomment this line and comment the line before
}

function gameLoop(){
    if(onceVar === false){
        once();
    } 
    executeMoves();
    ballMove();
    window.requestAnimationFrame(gameLoop);
}

function ballMove(){
    if(ball.y + ball.gravity <= 0 || ball.y + ball.gravity + ball.height >= canvas.height){
        ball.gravity = ball.gravity * (-1);
        ball.y += ball.gravity;
        ball.x += ball.speed;
    }
    else{
        ball.y += ball.gravity;
        ball.x += ball.speed;
    }
    wallHit();
}

function wallHit(){
    if((ball.y + ball.gravity < AIPaddle.y + AIPaddle.height && ball.x + ball.width + ball.speed > AIPaddle.x && ball.y + ball.gravity > AIPaddle.y) || (ball.y + ball.gravity > playerPaddle.y && ball.y + ball.gravity < playerPaddle.y + playerPaddle.height && ball.x + ball.speed < playerPaddle.x + playerPaddle.width)){
        ball.speed = ball.speed * (-1);
        ball.speed = ball.speed * 1.1;
        let o = Math.random();
        if(o<=0.5) sfx.hit1.play();
        else sfx.hit2.play();
    }
    else if(ball.x + ball.speed < playerPaddle.x - playerPaddle.width){
        sessionStorage.setItem("ATS", 1);
        if(sessionStorage.getItem("AIS")) AIScore = sessionStorage.getItem("AIS");
        else sessionStorage.setItem("AIS", AIScore);
        AIScore = parseInt(AIScore);
        AIScore+=1;
        sessionStorage.setItem("AIS", AIScore);
        window.location.reload();
        thisFunctionDoesNotDoAnythingAndExistsOnlyToStopJSFromExecuting();
    }
    else if(ball.x + ball.speed > AIPaddle.x + AIPaddle.width){
        sessionStorage.setItem("ATS", 1);
        if(sessionStorage.getItem("PS")) playerScore = sessionStorage.getItem("PS");
        else sessionStorage.setItem("PS", playerScore);
        playerScore = parseInt(playerScore);
        playerScore+=1;
        sessionStorage.setItem("PS", playerScore);
        window.location.reload();
        thisFunctionDoesNotDoAnythingAndExistsOnlyToStopJSFromExecuting();
    }
    drawElements();
}

let onceVar = false;

function once(){
    let x = Math.random();
    let y = Math.random();
    let z = Math.random();
    let u = Math.random();
    if(x>=0.5) ball.speed = -2*x;
    if(y>=0.5) ball.gravity = -2*y;
    if(z>=0.5) ball.speed = 2*z;
    if(u>=0.5) ball.gravity = 2*u;
    onceVar = true;
}

let winScore;

if(!sessionStorage.getItem("ATS")){
    alert("You're about to start the Game!");
    winScore = parseInt(prompt('Set winning score:'));
    while(!/^[0-9.,]+$/.test(winScore) || winScore == 0){
        winScore = parseInt(prompt('Set winning score:'));
    }
    sessionStorage.setItem("WS", winScore);
} 

let playerScore = 0;
let AIScore = 0;

const checkScore = setInterval(()=>{
    if(sessionStorage.getItem("WS")==sessionStorage.getItem("PS")){
        sfx.win.play();
        alert("Player 1 is the Winner!")
        clearInterval(checkScore);
        sessionStorage.removeItem("ATS");
        sessionStorage.removeItem("PS");
        sessionStorage.removeItem("AIS");
        sessionStorage.removeItem("WS");
        playerScore=0;
        AIScore=0;
        window.location.reload();
    }
    else if(sessionStorage.getItem("WS")==sessionStorage.getItem("AIS")){
        sfx.win.play();
        alert("Player 2 is the Winner!")
        clearInterval(checkScore);
        sessionStorage.removeItem("ATS");
        sessionStorage.removeItem("PS");
        sessionStorage.removeItem("AIS");
        sessionStorage.removeItem("WS");
        playerScore=0;
        AIScore=0;
        window.location.reload();
    }
},100)

gameLoop();