import * as Constants from '/src/constants';
const GAMESTATE = Constants.GAMESTATE;

export default class StateManager{
    constructor(game){
        this.game = game;

    }

    draw(context){
        let stateText = "SOBER!";
        let textColor = "#000000";
        if(this.game.gameState === GAMESTATE.MISSED){
            textColor = "#f80000";
            stateText = "MISSED!";
        } else if(this.game.gameState === GAMESTATE.SPILLED){
            textColor = "#f80000";
            stateText = "SPILLED!";
        } else if(this.game.gameState === GAMESTATE.WON){
            textColor = "#50C878";
            stateText = "WON!";
        } else if(this.game.gameState === GAMESTATE.CONGRATS){
            textColor = "#50C878";
            stateText = "CONGRATS!";
        }

        if([GAMESTATE.POURED, GAMESTATE.MISSED, GAMESTATE.WON, GAMESTATE.SPILLED, GAMESTATE.CONGRATS].includes(this.game.gameState)){
            context.rect(0, 0, this.game.gameWidth, this.game.gameHeight);
            context.fillStyle = "rgba(0, 0, 0, 0.5)";
            context.fill();

            context.font = "32px Arial";
            context.textAlign = "center";
            context.fillStyle = textColor;
            context.fillText(
                stateText, 
                this.game.gameWidth/2,
                this.game.gameHeight/2
            );    
        }

    }

    update(deltaTime){        
    }
}