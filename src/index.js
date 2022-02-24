import Game from '/src/game/scene';

let canvas = document.getElementById("game-screen");
let context = canvas.getContext("2d");
canvas.width = window.innerWidth - 5;
canvas.height = window.innerHeight - 5;

const GAME_WIDTH = canvas.width;
const GAME_HEIGHT = canvas.height;

window.addEventListener("resize", function(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

let game = new Game(GAME_WIDTH, GAME_HEIGHT);

let lastTime = 0;

function gameLoop(timestamp){
    let deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    context.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    game.update(deltaTime);
    game.draw(context);

    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
