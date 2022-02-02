import Can from '/src/can';
import Cup from '/src/cup';

const GAMESTATE = {
    PAUSED: 0,
    RUNNING: 1,
    MENU: 2,
}

export default class Game{
    constructor(gameWidth, gameHeight){
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.gameObjects = [];
        this.gameState = GAMESTATE.MENU;
        
        this.can = new Can(this);
        this.cups = [
            new Cup(this, {x: 12}),
            new Cup(this, {x: this.gameWidth/2}),
            new Cup(this, {x: this.gameWidth - 96}),
        ];

        this.start();
    }

    start(){
        if(
            this.gameState !== GAMESTATE.MENU && 
            this.gameState !== GAMESTATE.NEWLEVEL
        ) return;

        this.can.reset();

        this.gameObjects = [this.can,...this.cups];

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