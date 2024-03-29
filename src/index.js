import Phaser from "phaser";
import playScene from "./scenes/PlayScene";
import menuScene from "./scenes/MenuScene";
import preloadScene from "./scenes/PreloadScene";
import scoreScene from "./scenes/ScoreScene";
import pauseScene from "./scenes/PauseScene";

const width = 540;
const height = 600;
const birdPos = {x: width * 0.1, y : height/2};

// Created new variable that is holding object that ve have had and the starting position and we provide instance of them to new scene which we can reach from constructor
const sharedConfig = {
    width: width,
    height: height,
    startPos: birdPos,
}
const scenes = [preloadScene, menuScene, playScene, scoreScene, pauseScene];
const initScenes = () => scenes.map((Scene) => new Scene(sharedConfig));
const config = {
    type: Phaser.AUTO,
    ...sharedConfig,
    pixelArt: true,
    physics: {
        // Arcade physics plugin.
        default: "arcade",
        arcade: {
            // gizmos of game objects
            debug: false
        }
    },
    scene: initScenes()
}

new Phaser.Game(config);

