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
        this.pipeVelocity = -200;
        this.playScore = 0;
        this.playerScoreText = '';
        this.playerBestScoreText = '';
    }


    preload() {
        this.load.image("sky", "assets/sky.png");
        this.load.image("bird", "assets/bird.png");
        this.load.image("pipe", "assets/pipe.png");

    }
    create() {
        this.createBg();
        this.createBird();
        this.createPipes();
        this.inputController();
        this.createColliders();
        this.createPlayerScore();
    }

    createBg() {
        this.add.image(0, 0, "sky").setOrigin(0);
    }

    createBird() {
        this.bird = this.physics.add.sprite(this.config.startPos.x, this.config.startPos.y, "bird").setOrigin(0);
        this.bird.body.gravity.y = 400;
    }

    createPipes(){
        this.pipes= this.physics.add.group();
        for (let i = 0; i <pipesToRender; i ++) {

            const upperPipe = this.pipes.create(0,0,"pipe").setImmovable(true).setOrigin(0,1);
            const lowerPipe = this.pipes.create(0,0 ,"pipe").setImmovable(true).setOrigin(0,0);
            this.placePipes(upperPipe,lowerPipe);
        }
        this.pipes.setVelocityX(this.pipeVelocity);
    }

    createColliders(){
        this.bird.setCollideWorldBounds(true);
        this.physics.add.collider(this.bird,this.pipes,this.gameOver,null, this);
    }

    createPlayerScore(){
        this.playScore = 0;
        const bestScore = localStorage.getItem('bestScore');
        this.playerScoreText = this.add.text(16,16, `Score:  ${0}`, {
            fontsize:'38px',
            fill: '#000'
        });
        this.playerBestScoreText = this.add.text(16,40, `Best Score:  ${bestScore || 0}`, {
            fontsize:'32px',
            fill: '#000'
        });
    }

    increaseScore(){
        this.playScore++;
        this.playerScoreText.setText(`Score:  ${this.playScore}`)
    }
    savePlayerBestScore(){
        this.playerBestScoreText = localStorage.getItem('bestScore');
        const bestScore = this.playerBestScoreText && parseInt(this.playerBestScoreText,10);
        if(!bestScore || this.playScore > bestScore){
            localStorage.setItem('bestScore', this.playScore);
        }
    }


    inputController(){
        this.input.on("pointerdown" , this.bodyFlap,this);
        this.input.keyboard.on("keydown_SPACE" , this.bodyFlap,this);
    }

    update() {
        if(this.bird.getBounds().bottom >= this.config.height || this.bird.y <= 0) {
            // alert("you lost")
            this.gameOver();
        }
        this.recyclePipes();
    }

    gameOver(){
        this.physics.pause();

        //Restart event
        this.time.addEvent({
            delay:1000,
            callback: ()=> {
            this.scene.restart();
                this.restartPlayerPosition();
            },
            loop: false
        })
        this.savePlayerBestScore();

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
                    this.increaseScore();
                    this.savePlayerBestScore();
                }
            }
        })
    }


     restartPlayerPosition() {
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
