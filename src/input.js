import * as Constants from '/src/constants';
import Score from '/src/score';

const GAMESTATE = Constants.GAMESTATE;

export default class InputHandler{
    constructor(game) {
        this.game = game;
        this.canvas = document.getElementById("game-screen");
        this.bgMusic = document.getElementById("bg_music");
        this.startSound = document.getElementById("start_sound");
        this.pourSound = document.getElementById("pour_sound");
        this.winSound = document.getElementById("win_sound");
        this.congratsSound = document.getElementById("congrats_sound");
        this.failSound = document.getElementById("fail_sound");
        this.overSound = document.getElementById("over_sound");
        this.score = new Score(game);
        let clickCounter = 0;
        document.addEventListener('click', (event) => {
            clickCounter += 1;
            if(clickCounter === 1){
                this.sound(this.bgMusic, 0.1)
            }
        });

        this.canvas.addEventListener("click", (e) => {
            if(game.gameState === GAMESTATE.RUNNING){
                game.gameState = GAMESTATE.POURED;

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
            this.sound(this.startSound);
            this.play();
        });

        game.continueBtn.addEventListener("click", (e) => {
            this.sound(this.startSound);
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
    sound(audio, volume = 0.2){
        audio.pause();
        audio.currentTime = 0;
        audio.volume = volume;
        audio.play();

    }
}