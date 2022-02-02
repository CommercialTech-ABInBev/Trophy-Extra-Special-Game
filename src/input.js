import * as Constants from '/src/constants';
const GAMESTATE = Constants.GAMESTATE;

export default class InputHandler{
    constructor(game) {
        let canvas = document.getElementById("game-screen");
        canvas.addEventListener("click", (e) => {
            console.log(game.can.position)
            game.gameState = GAMESTATE.RETRY;
        });

    }
}