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
let upperPipe = null;
let lowerPipe = null;
let pipeHorizontalDistance = 0;

const initialPos = {
    x:config.width * 0.1,
    y: config.height / 2
}

const flappingVelocity = 300;
const pipesToRender = 4;
const pipeVerticalDistance = [150,250];

// Initialize assets
function create() {

    this.add.image(0, 0, "sky").setOrigin(0);
    bird = this.physics.add.sprite(initialPos.x, initialPos.y, "bird").setOrigin(0);
    bird.body.gravity.y = 400;
    this.input.on("pointerdown" , bodyFlap);
    this.input.keyboard.on("keydown_SPACE" , bodyFlap);

    for (let i = 0; i <pipesToRender; i ++) {
        pipeHorizontalDistance += 400;
        let pipeRange = Phaser.Math.Between(...pipeVerticalDistance);
        let pipeVerticalPosition = Phaser.Math.Between(0+20,config.height- 20- pipeRange);

        upperPipe = this.physics.add.sprite(pipeHorizontalDistance,pipeVerticalPosition,"pipe").setOrigin(0,1);
        lowerPipe = this.physics.add.sprite(upperPipe.x,upperPipe.y + pipeRange,"pipe").setOrigin(0,0);

        upperPipe.body.velocity.x = -200;
        lowerPipe.body.velocity.x = -200;
    }


}

//60 fps
// 60 times per second
// 60 * 16ms = 1000ms

function update() {
    if(bird.y > config.height || bird.y < - 0) {
        // alert("you lost")
        RestartPlayerFunction();
    }

}

function RestartPlayerFunction() {
bird.x = initialPos.x;
bird.y = initialPos.y;
bird.body.velocity.y = 0;
}

function bodyFlap() {
bird.body.velocity.y = -flappingVelocity;
}

new Phaser.Game(config);

