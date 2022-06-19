import Phaser from "phaser";
import playScene from "./scenes/PlayScene";

const width = 800;
const height = 600;
const birdPos = {x: width * 0.1, y : height/2};

// Created new variable that is holding object that ve have had and the starting position and we provide instance of them to new scene which we can reach from constructor
const sharedConfig = {
    width: width,
    height: height,
    startPos: birdPos,
}

const config = {
    type: Phaser.AUTO,
    ...sharedConfig,
    physics: {
        // Arcade physics plugin.
        default: "arcade",
        arcade: {
            // gizmos of game objects
            debug: true
        }
    },
    scene: [new playScene(sharedConfig)]
}

new Phaser.Game(config);

