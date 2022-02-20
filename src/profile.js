export default class Profile{
    constructor(game){
        this.game = game;

        this.heart = {
            image: document.getElementById("img-heart"),
            position: {x: 28, y: 28},
            size: {width: 24, height: 24},
            lives: 0
        };

        this.crate = {
            image: document.getElementById("img-can"),
            position: {x: this.game.gameWidth - 30, y: 20},
            size: {width: 16, height: 24},
            can: 0
        };
    }

    drawUser(context){
        context.font = "16px Arial";
        context.fillStyle = "#ffffff";
        context.textAlign = "center";
        context.fillText(
            this.game.user.fullName, 
            this.heart.position.x + 30, 
            this.heart.position.y - 5, 
        );
    }

    drawHeart(context){
        context.font = "24px Arial";
        context.fillStyle = "#ffffff";
        context.textAlign = "center";
        context.fillText(
            this.heart.lives, 
            this.heart.position.x - 10, 
            this.heart.position.y + 20, 
        );

        context.drawImage(
            this.heart.image, 
            this.heart.position.x, 
            this.heart.position.y, 
            this.heart.size.width, 
            this.heart.size.height
        );
    }

    drawCrate(context){
        context.font = "24px Arial";
        context.fillStyle = "#ffffff";
        context.textAlign = "center";
        context.fillText(
            this.crate.can, 
            this.crate.position.x - 18, 
            this.crate.position.y + 20, 
        );

        context.drawImage(
            this.crate.image, 
            this.crate.position.x, 
            this.crate.position.y, 
            this.crate.size.width, 
            this.crate.size.height
        );        
    }

    draw(context){
        this.heart.lives = this.game.user.daily.lives
        this.crate.can = this.game.user.can.count

        this.drawUser(context);
        this.drawHeart(context);
        this.drawCrate(context);
    }

    update(deltaTime){        
    }
}