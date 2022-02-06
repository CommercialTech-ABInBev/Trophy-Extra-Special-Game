import * as Constants from '/src/constants';
const GAMESTATE = Constants.GAMESTATE;

export default class InputHandler{
    constructor(game) {
        this.game = game;
        let canvas = document.getElementById("game-screen");

        canvas.addEventListener("click", (e) => {
            if(game.gameState === GAMESTATE.RUNNING){
                game.gameState = GAMESTATE.RETRY;
                game.retryButton.visible = true;

                const canSpot = game.can.position.x;
                console.log("Can Spot: ", canSpot);

                let poured = false;
                let spilled = false;

                game.cups.map((cup) => {
                    const accurrancy = 1;
                    const cupX = (cup.position.x) + accurrancy;
                    const cupSpot = (cupX + cup.size.width) - accurrancy;
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

                if(spilled){
                    console.log("Oops! Spilled")
                    this.emptyCups();
                } else if(poured){
                    console.log("Won!");

                    const fullCups = game.cups.filter((cup) => { return cup.full});
                    console.log("Full cups: ",fullCups.length);
                    if(fullCups.length === 3){
                        console.log("Congratulation!");
                        this.emptyCups();
                    }
                } else {
                    console.log("Missed!");
                    this.emptyCups();
                }

            }
        });

        let retryBtn = document.getElementById("img-retry");
        retryBtn.addEventListener("click", (e) => {
            game.can.reset();
            game.gameState = GAMESTATE.RUNNING;
        });
    }

    emptyCups(){
        this.game.cups.map((cup) => {
            cup.full = false;
        });
    }
}