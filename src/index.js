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
const initialPos = {
    x:config.width * 0.1,
    y: config.height / 2
}
const flappingVelocity = 300;

// Loading assets, animations, images etc
function preload() {
    this.load.image("sky", "assets/sky.png");
    this.load.image("bird", "assets/bird.png")
}

// Initialize assets
function create() {

    this.add.image(0, 0, "sky").setOrigin(0);
    bird = this.physics.add.sprite(initialPos.x, initialPos.y, "bird").setOrigin(0);
    this.input.on("pointerdown" , bodyFlap);
    this.input.keyboard.on("keydown_SPACE" , bodyFlap);
}

//60 fps
// 60 times per second
// 60 * 16ms = 1000ms

function update(time, delta) {
    if(bird.y > config.height || bird.y < - 0) {
        alert("you lost")
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

