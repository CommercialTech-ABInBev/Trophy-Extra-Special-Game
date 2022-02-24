export default class Profile{
    constructor(game){
        this.game = game;

        this.heart = {
            image: document.getElementById("img-heart"),
            position: {x: 28, y: 24},
            size: {width: 24, height: 25},
            lives: 0
        };

        this.can = {
            image: document.getElementById("img-can"),
            position: {x: this.game.gameWidth - 30, y: 25},
            size: {width: 16, height: 24},
            count: 0
        };
    }

    drawUser(context){
        context.font = "20px Arial";
        context.fillStyle = "#ffffff";
        context.textAlign = "center";
        context.fillText(
            this.game.user.fullName, 
            this.game.gameWidth/2, 
            25, 
        );
    }

    drawHeart(context){
        context.font = "24px Arial";
        context.fillStyle = "#ffffff";
        context.textAlign = "center";
        context.fillText(
            this.game.user.daily.lives, 
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

    drawCan(context){
        context.font = "24px Arial";
        context.fillStyle = "#ffffff";
        context.textAlign = "center";
        context.fillText(
            this.game.user.can.count, 
            this.can.position.x - 18, 
            this.can.position.y + 20, 
        );

        context.drawImage(
            this.can.image, 
            this.can.position.x, 
            this.can.position.y, 
            this.can.size.width, 
            this.can.size.height
        );        
    }

    draw(context){
        const user = this.game.user;
        if(user && user.daily && user.can && user.fullName){
            this.drawUser(context);
            this.drawHeart(context);
            this.drawCan(context);    
        }
    }

    update(deltaTime){        
    }
}