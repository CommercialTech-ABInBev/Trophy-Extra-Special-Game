import Profile from './profile';
import Can from './objects/can';
import Cup from './objects/cup';
import InputHandler from './input';
import * as Constants from '../utils/constants';
import App from '../app/view';

const GAMESTATE = Constants.GAMESTATE;

export default class Game{
    constructor(gameWidth, gameHeight){
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.gameObjects = [];
        this.gameState = GAMESTATE.MENU;

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
        this.gameObjects = [this.profile];            

        if(this.app.controller.checkDaily()){
            this.cups = [
                new Cup(this, {x: (this.cupWidth) - (this.cupWidth/2)}),
                new Cup(this, {x: ((this.gameWidth/2 - (this.cupWidth/2)))}),
                new Cup(this, {x: (this.gameWidth - this.cupWidth) - (this.cupWidth/2)}),
            ];
            this.gameObjects = [this.profile,this.can,...this.cups];            
        } else {
            this.gameState = GAMESTATE.GAMEOVER;
            this.app.renderResult();  
        }
    }

    menu(){
        this.gameState = GAMESTATE.MENU;
        this.appView.classList.remove("hide");
        this.app.menu();     

        this.app.renderResult(GAMESTATE.CONGRATS)
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