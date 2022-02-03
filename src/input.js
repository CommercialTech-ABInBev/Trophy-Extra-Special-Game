import * as Constants from '/src/constants';
const GAMESTATE = Constants.GAMESTATE;

export default class InputHandler{
    constructor(game) {
        let canvas = document.getElementById("game-screen");
        canvas.addEventListener("click", (e) => {
            game.gameState = GAMESTATE.RETRY;
            game.retryButton.visible = true;
        });

        let retryBtn = document.getElementById("img-retry");
        retryBtn.addEventListener("click", (e) => {
            game.retryButton.visible = false;
            game.gameState = GAMESTATE.RUNNING;
        });
    }
}