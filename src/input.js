import * as Constants from '/src/constants';
import Score from '/src/score';

const GAMESTATE = Constants.GAMESTATE;

export default class InputHandler{
    constructor(game) {
        this.game = game;
        let canvas = document.getElementById("game-screen");
        this.pourSound = document.getElementById("pour_sound");
        this.score = new Score(game);

        canvas.addEventListener("click", (e) => {
            if(game.gameState === GAMESTATE.RUNNING){
                game.gameState = GAMESTATE.POURED;
                this.pourSound.pause();
                this.pourSound.currentTime = 0;
                this.pourSound.volume = 0.2;
                this.pourSound.play();

                const {poured, spilled} = this.score.pour();

                if(spilled){
                    this.score.spill();
                } else if(poured){
                    this.score.win()
                } else {
                    this.score.miss();
                }
                game.app.renderResult(game.gameState);
            }
        });

        game.startBtn.addEventListener("click", (e) => {
            this.play();
        });

        game.continueBtn.addEventListener("click", (e) => {
            if([GAMESTATE.WON].includes(this.game.gameState)){
                this.play();
            }
        });
    }

    play(){
        document.getElementById("app").classList.add("hide")
        this.game.can.reset();
        this.game.app.renderInit();
        this.game.gameState = GAMESTATE.RUNNING;
        this.game.startBtn.classList.add("hide");
        this.game.continueBtn.classList.add("hide");
    }
}