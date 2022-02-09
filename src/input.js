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
                game.continueBtn.classList.add("show");

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

        game.continueBtn.addEventListener("click", (e) => {
            if([GAMESTATE.WON].includes(this.game.gameState)){
                game.can.reset();
                game.gameState = GAMESTATE.RUNNING;
            } else {
                game.start();
            }
            game.continueBtn.classList.remove("show");
        });
    }
}