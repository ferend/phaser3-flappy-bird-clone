import Phaser from "phaser";

const pipesToRender = 4;

class PlayScene extends Phaser.Scene{
    constructor(config) {
        super("PlayScene");
       this.config = config;
        this.bird = null;
        this.pipes = null
        this.flappingVelocity = 300;
        this.pipeVerticalDistanceRange = [150,250];
        this.pipeHorizontalDistanceRange = [500,600];


    }
    preload() {
        this.load.image("sky", "assets/sky.png");
        this.load.image("bird", "assets/bird.png");
        this.load.image("pipe", "assets/pipe.png");

    }
    create() {

        this.add.image(0, 0, "sky").setOrigin(0);
        this.bird = this.physics.add.sprite(this.config.startPos.x, this.config.startPos.y, "bird").setOrigin(0);
        this.bird.body.gravity.y = 400;

        this.pipes= this.physics.add.group();
        this.input.on("pointerdown" , this.bodyFlap,this);
        this.input.keyboard.on("keydown_SPACE" , this.bodyFlap,this);

        for (let i = 0; i <pipesToRender; i ++) {

            const upperPipe = this.pipes.create(0,0,"pipe").setOrigin(0,1);
            const lowerPipe = this.pipes.create(0,0 ,"pipe").setOrigin(0,0);
            this.placePipes(upperPipe,lowerPipe);
        }
        this.pipes.setVelocityX(-200);

    }

    update() {
        if(this.bird.y > this.config.height || this.bird.y < - this.bird.height) {
            // alert("you lost")
            this.restartPlayerFunction();
        }
        this.recyclePipes();
    }

     placePipes(uPipe,lPipe) {
        const rightMostXPos = this.placePipesCorrect();
        const pipeRange = Phaser.Math.Between(...this.pipeVerticalDistanceRange);
        const pipeVerticalPosition = Phaser.Math.Between(0+20,this.config.height- 20- pipeRange);
        const pipeHorizontalDistance = Phaser.Math.Between(...this.pipeHorizontalDistanceRange);
        uPipe.x = rightMostXPos + pipeHorizontalDistance;
        uPipe.y = pipeVerticalPosition;

        lPipe.x = uPipe.x;
        lPipe.y = uPipe.y + pipeRange;
    }

     recyclePipes() {
        const tempPipes = [];
        // when a pipe gets out of bounds reuse it with placepipe.
        this.pipes.getChildren().forEach(pipe => {
            if(pipe.getBounds().right <= 0) {
                tempPipes.push(pipe);
                if(tempPipes.length ===2) {
                    this.placePipes(...tempPipes);
                }
            }
        })
    }


     restartPlayerFunction() {
        this.bird.x = this.config.startPos.x;
         this.bird.y = this.config.startPos.y;
         this.bird.body.velocity.y = 0;
    }

     bodyFlap() {
         this.bird.body.velocity.y = -this.flappingVelocity;
    }

     placePipesCorrect() {
        let rightMostX = 0;
         this.pipes.getChildren().forEach(pipe => {
            rightMostX = Math.max(pipe.x,rightMostX);
        })
        return rightMostX;
    }


}
export default PlayScene;
