import Profile from '/src/profile';
import Can from '/src/can';
import Cup from '/src/cup';
import InputHandler from '/src/input';
import * as Constants from '/src/constants';
import StateManager from '/src/stateManager'
import App from '/src/app';

const GAMESTATE = Constants.GAMESTATE;

export default class Game{
    constructor(gameWidth, gameHeight){
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.gameObjects = [];
        this.gameState = GAMESTATE.MENU;
        this.stateManager = new StateManager(this);

        this.appView = document.getElementById("app");
        this.startBtn = document.getElementById("start-btn");
        this.continueBtn = document.getElementById("continue-btn");

        this.profile = new Profile(this)
        this.can = new Can(this);

        this.cupWidth = 80;
        this.cupHeight = 128;
        this.cups = [];
        
        this.app = new App(this);

        this.user = {};

        this.input = new InputHandler(this);        
        this.menu();
    }

    start(){
        this.can.reset();
        this.app.renderResult();

        if(this.user.daily.lives > 0){
            this.cups = [
                new Cup(this, {x: (this.cupWidth) - (this.cupWidth/2)}),
                new Cup(this, {x: ((this.gameWidth/2 - (this.cupWidth/2)))}),
                new Cup(this, {x: (this.gameWidth - this.cupWidth) - (this.cupWidth/2)}),
            ];
            this.gameObjects = [this.profile,this.can,...this.cups,this.stateManager];            
        } else {
            this.gameState = GAMESTATE.GAMEOVER;
            this.app.renderResult();  
        }
    }

    menu(){
        this.gameState = GAMESTATE.MENU;
        this.appView.classList.remove("hide");
        this.app.menu();     
        
        // this.start();
    }

    update(deltaTime){
        [...this.gameObjects].forEach((object) => {
            object.update(deltaTime)
        });
    }

    draw(context){
        [...this.gameObjects].forEach((object) => {
            object.draw(context)
        });
    }

}