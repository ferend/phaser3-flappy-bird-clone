import Phaser from "phaser";

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        // Arcade physics plugin.
        default: "arcade",
        arcade: {
            // gizmos of game objects
            debug: true
        }
    },
    scene: {
        preload: preload,
        create: create,
        update
    },
}

// Loading assets, animations, images etc
function preload() {
    this.load.image("sky", "assets/sky.png");
    this.load.image("bird", "assets/bird.png");
    this.load.image("pipe", "assets/pipe.png");
}

let bird = null;
let pipes = null;

const initialPos = {
    x:config.width * 0.1,
    y: config.height / 2
}

const flappingVelocity = 300;
const pipesToRender = 4;
const pipeVerticalDistanceRange = [150,250];
const pipeHorizontalDistanceRange = [500,600];

// Initialize assets
function create() {

    this.add.image(0, 0, "sky").setOrigin(0);
    bird = this.physics.add.sprite(initialPos.x, initialPos.y, "bird").setOrigin(0);
    bird.body.gravity.y = 400;
    pipes= this.physics.add.group();
    this.input.on("pointerdown" , bodyFlap);
    this.input.keyboard.on("keydown_SPACE" , bodyFlap);

    for (let i = 0; i <pipesToRender; i ++) {

        const upperPipe = pipes.create(0,0,"pipe").setOrigin(0,1);
        const lowerPipe = pipes.create(0,0 ,"pipe").setOrigin(0,0);
        placePipes(upperPipe,lowerPipe);
    }
pipes.setVelocityX(-200);

}

//60 fps
// 60 times per second
// 60 * 16ms = 1000ms

function update() {
    if(bird.y > config.height || bird.y < - 0) {
        // alert("you lost")
        restartPlayerFunction();
    }
recyclePipes();
}

function restartPlayerFunction() {
bird.x = initialPos.x;
bird.y = initialPos.y;
bird.body.velocity.y = 0;
}

function bodyFlap() {
bird.body.velocity.y = -flappingVelocity;
}

function placePipes(uPipe,lPipe) {
    const rightMostXPos = placePipesCorrect();
    const pipeRange = Phaser.Math.Between(...pipeVerticalDistanceRange);
    const pipeVerticalPosition = Phaser.Math.Between(0+20,config.height- 20- pipeRange);
    const pipeHorizontalDistance = Phaser.Math.Between(...pipeHorizontalDistanceRange);
    uPipe.x = rightMostXPos + pipeHorizontalDistance;
    uPipe.y = pipeVerticalPosition;

    lPipe.x = uPipe.x;
    lPipe.y = uPipe.y + pipeRange;
}

function recyclePipes() {
    const tempPipes = [];
    // when a pipe gets out of bounds reuse it with placepipe.
pipes.getChildren().forEach(pipe => {
    if(pipe.getBounds().right <= 0) {
        tempPipes.push(pipe);
        if(tempPipes.length ===2) {
            placePipes(...tempPipes);
        }
    }
})
}

function placePipesCorrect() {
let rightMostX = 0;
pipes.getChildren().forEach(pipe => {
rightMostX = Math.max(pipe.x,rightMostX);
})
return rightMostX;
}


new Phaser.Game(config);

