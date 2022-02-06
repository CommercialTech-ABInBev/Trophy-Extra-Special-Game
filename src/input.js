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

        let retryBtn = document.getElementById("img-retry");
        retryBtn.addEventListener("click", (e) => {
            game.can.reset();
            game.gameState = GAMESTATE.RUNNING;
        });
    }
}