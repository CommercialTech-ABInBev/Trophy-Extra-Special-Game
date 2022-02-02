import Can from '/src/can';

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

        // new InputHandler(this);        

        this.start();
    }

    start(){
        if(
            this.gameState !== GAMESTATE.MENU && 
            this.gameState !== GAMESTATE.NEWLEVEL
        ) return;

        this.can.reset();

        this.gameObjects = [this.can];

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