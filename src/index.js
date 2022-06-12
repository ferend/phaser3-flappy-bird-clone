import Phaser from "phaser";

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        // Arcade physics plugin.
        default: "arcade",
        arcade: {
            gravity: {y: 400},
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

let bird = null;
let totalDelta = null;
const flappingVelocity = 300;

// Loading assets, animations, images etc
function preload() {
    this.load.image("sky", "assets/sky.png");
    this.load.image("bird", "assets/bird.png")
}

// Initialize assets
function create() {

    this.add.image(0, 0, "sky").setOrigin(0);
    bird = this.physics.add.sprite(config.width * 0.1, config.height / 2, "bird").setOrigin(0);
    //bird.body.velocity.x = xVelocity;

    this.input.on("pointerdown" , bodyFlap);
    this.input.keyboard.on("keydown_SPACE" , bodyFlap);
}

//60 fps
// 60 times per second
// 60 * 16ms = 1000ms

function update(time, delta) {
    totalDelta += totalDelta + delta;

    // if (bird.x < config.width - bird.width) {
    //     if (bird.x <= 0) {
    //         bird.body.velocity.x = xVelocity;
    //     }
    // } else {
    //     bird.body.velocity.x = -xVelocity;
    // }

}

function bodyFlap() {
bird.body.velocity.y = -flappingVelocity;
}

new Phaser.Game(config);

