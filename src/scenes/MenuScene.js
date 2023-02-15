import BaseScene from "./BaseScene";

class MenuScene extends BaseScene{
    constructor(config) {
        super('MenuScene', config);
        this.config = config;
        this.menu = [
            {scene : 'PlayScene',text :'Play'},
            {scene : 'ScoreScene',text :'Leaderboard'},
            {scene : null, text :'Exit'}
        ]

    }

    create(){
        super.create();
        this.createMenu(this.menu, this.menuEvents.bind(this));
    }

    menuEvents(menuItem){
        const textGameObject = menuItem.textGameObject;
        textGameObject.setInteractive();

        textGameObject.on('pointerover', () => {
            textGameObject.setStyle({fill : '#8BA363'})
        });
        textGameObject.on('pointerout', () => {
            textGameObject.setStyle({fill : '#00000f'})
        });
        textGameObject.on('pointerup', () => {
            menuItem.scene && this.scene.start(menuItem.scene);
            if(menuItem.text === 'Exit') {
                console.log(' Exit Game ');
                this.game.destroy(true);
            }
        });
    }
}

export default MenuScene;
