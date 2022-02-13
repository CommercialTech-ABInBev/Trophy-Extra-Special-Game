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

        this.can = new Can(this);

        this.cupWidth = 80;
        this.cupHeight = 128;
        this.cups = [];
        
        this.app = new App(this);

        this.user = {};

        new InputHandler(this);        
        this.menu();
        // this.start();
    }

    start(){
        this.can.reset();

        this.cups = [
            new Cup(this, {x: (this.cupWidth) - (this.cupWidth/2)}),
            new Cup(this, {x: ((this.gameWidth/2 - (this.cupWidth/2)))}),
            new Cup(this, {x: (this.gameWidth - this.cupWidth) - (this.cupWidth/2)}),
        ];
        this.gameObjects = [this.can,...this.cups,this.stateManager];

        this.gameState = GAMESTATE.INIT;
        this.appView.classList.remove("show");
        this.appView.innerHTML = "";
        this.startBtn.classList.add("show");
    }

    menu(){
        this.gameState = GAMESTATE.MENU;
        this.appView.classList.add("show");
        this.app.menu()
        this.app.renderResult();
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