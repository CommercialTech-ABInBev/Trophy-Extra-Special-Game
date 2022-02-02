export default class Can{
    constructor(game){
        this.gameWidth = game.gameWidth;
        this.gameHeight = game.gameHeight;

        this.game = game;

        this.image = document.getElementById("img-can");

        this.reset();

        this.size = {width: 64, height: 128};

    }

    reset(){
        this.position = { x: this.gameWidth/2, y: this.gameHeight/5 };
        this.speed = { x: 5, y: 0 };
    }

    pour(){
        this.speed = { x: 0, y: 0 };
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
        this.position.x += this.speed.x;
        this.position.y += this.speed.y;

        if(this.position.x + this.size.width > this.gameWidth || this.position.x < 0){
            this.speed.x *= -1
        }
    }
}