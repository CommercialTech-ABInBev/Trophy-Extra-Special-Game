import * as Constants from '/src/constants';
import Score from '/src/score';

const GAMESTATE = Constants.GAMESTATE;

export default class InputHandler{
    constructor(game) {
        this.game = game;
        let canvas = document.getElementById("game-screen");
        this.score = new Score(game);

        canvas.addEventListener("click", (e) => {
            if(game.gameState === GAMESTATE.RUNNING){
                game.gameState = GAMESTATE.POURED;
                game.retryButton.visible = true;

                const {poured, spilled} = this.score.pour();

                if(spilled){
                    this.score.spill();
                } else if(poured){
                    this.score.win()
                } else {
                    this.score.miss();
                }

            }
        });

        let startBtn = document.getElementById("start-btn");
        startBtn.addEventListener("click", (e) => {
            game.start();
            game.gameState = GAMESTATE.RUNNING;
            startBtn.classList.remove("show");
        });

        let continueBtn = document.getElementById("continue-btn");
        continueBtn.addEventListener("click", (e) => {
            if([GAMESTATE.WON].includes(this.game.gameState)){
                game.can.reset();
            }
            continueBtn.classList.remove("show");
        });

        let retryBtn = document.getElementById("img-retry");
        retryBtn.addEventListener("click", (e) => {
            if([GAMESTATE.WON].includes(this.game.gameState)){
                game.can.reset();
            } else {
                game.start();
            }
            game.gameState = GAMESTATE.RUNNING;
        });
    }
}