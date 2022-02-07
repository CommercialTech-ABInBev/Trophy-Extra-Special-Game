import * as Constants from '/src/constants';
const GAMESTATE = Constants.GAMESTATE;

export default class Score{
    constructor(game) {
        this.game = game;
    }

    pour(){
        this.game.can.depth = 0;
        let poured = false;
        let spilled = false;

        const canSpot = this.game.can.position.x;
        console.log("Can Spot: ", canSpot);

        this.game.cups.map((cup) => {
            const leftError = 10;
            const rightError = 20;
            const cupX = (cup.position.x) + leftError;
            const cupSpot = (cupX + cup.size.width) - rightError;
            console.log(`Expect region ${cupX} - ${cupSpot}`);
            if(canSpot >= cupX && canSpot <= cupSpot){
                if(cup.full){
                    spilled = true;
                } else {
                    poured = true;
                    cup.full = true;
                }
            }
        }); 

        return {spilled, poured};
    }

    miss(){
        this.game.gameState = GAMESTATE.MISSED;
        console.log("Missed!");
        this.emptyCups();
    }

    spill(){
        this.game.gameState = GAMESTATE.SPILLED;
        console.log("Spilled!");        
        this.emptyCups();
    }

    win(){
        this.game.gameState = GAMESTATE.WON;
        console.log("Won!");

        const fullCups = this.game.cups.filter((cup) => { return cup.full});
        console.log("Full cups: ",fullCups.length);
        if(fullCups.length === 3){
            this.game.gameState = GAMESTATE.CONGRATS;
            console.log("Congratulation!");
            this.emptyCups();
        }
    }
    
    emptyCups(){
        this.game.cups.map((cup) => {
            cup.full = false;
        });
    }
}