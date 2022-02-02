export default class Cup{
    constructor(game, position){
        this.gameWidth = game.gameWidth;
        this.gameHeight = game.gameHeight;

        this.game = game;

        this.image = document.getElementById("img-cup");

        this.size = {width: 80, height: 128};
        this.position = position;
        this.position.y = this.gameHeight - (this.size.height + 50);
    }

    draw(context){
        context.save();
        context.drawImage(
            this.image, 
            this.position.x, 
            this.position.y, 
            this.size.width, 
            this.size.height
        );
        context.restore();
    }

    update(deltaTime){        
    }
}