export default class Cup{
    constructor(game, position){
        this.gameWidth = game.gameWidth;
        this.gameHeight = game.gameHeight;

        this.game = game;

        this.image = document.getElementById("img-cup");

        this.size = {width: 80, height: 128};
        this.position = position;
        this.position.y = this.gameHeight - (this.size.height + 10);
        this.full = false;
        this.filling = false;
        this.fillingSize = 4;
        this.imageFrame = 0;
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

        // context.beginPath(); 
        // context.moveTo(this.game.can.position.x,this.game.can.position.y);
        // context.lineTo(this.position.x, this.position.y);
        // context.stroke();

    }

    update(deltaTime){
        if(this.filling && ((this.position.y - this.size.height) <= this.game.can.depth)){
            this.fill();
        }
    }

    fill(){
        this.imageFrame += 1;
        const frame = parseInt(this.imageFrame);            
        if(this.imageFrame > 0 && this.imageFrame <= this.fillingSize){
            this.image = document.getElementById("img-cup"+frame);
        } else {
            this.imageFrame = 0;
            this.filling = false;
        }
    }
}