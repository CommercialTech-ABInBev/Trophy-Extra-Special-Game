import Can from '/src/can';
import Cup from '/src/cup';
import RetryButton from '/src/retryButton';
import InputHandler from '/src/input';
import * as Constants from '/src/constants';
import StateManager from '/src/stateManager'

const GAMESTATE = Constants.GAMESTATE;

export default class Game{
    constructor(gameWidth, gameHeight){
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.gameObjects = [];
        this.gameState = GAMESTATE.MENU;
        this.stateManager = new StateManager(this);
        this.retryButton = new RetryButton(this);

        this.can = new Can(this);
        this.cups = [
            new Cup(this, {x: (this.gameWidth/3.5)}),
            new Cup(this, {x: (this.gameWidth/1.9)}),
            new Cup(this, {x: (this.gameWidth/1.3)}),
        ];
        
        new InputHandler(this);        
        this.start();
    }

    start(){
        this.can.reset();

        this.gameObjects = [this.can,this.retryButton,...this.cups,this.stateManager];

        this.gameState = GAMESTATE.RUNNING;
    }

    update(deltaTime){
        if(this.gameState !== GAMESTATE.RUNNING) return;

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