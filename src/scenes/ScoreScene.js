import BaseScene from "./BaseScene";

class ScoreScene extends BaseScene {
    constructor(config) {
        super('ScoreScene', config);
        this.config = config;
    }

    create(){
        super.create();
        console.log(`Player best Score is ${localStorage.getItem('bestScore')}`);
        const bestScoreText = `Player best score is:  ${localStorage.getItem('bestScore')}`;
        this.add.text(...this.screenCenter, bestScoreText).setOrigin(0.5);
    }
}




export default ScoreScene;

