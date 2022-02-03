export default class RetryButton{
    constructor(game){
        this.game = game;
    }
    
    draw(context){
        const retryBtn = document.getElementById("img-retry");
        if(this.visible){
            retryBtn.classList.add("show");
        } else {
            retryBtn.classList.remove("show");
        }
    }

    update(deltaTime){ 
    }
}