import BaseScene from "./BaseScene";

class PauseScene extends BaseScene{
    constructor(config) {
        super('PauseScene', config);
        this.config = config;
        this.menu = [
            {scene : 'PlayScene',text :'Continue'},
            {scene : 'Exit',text :'Exit'},
        ]

    }
    create(){
        // super.create();
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
            if(menuItem.scene && menuItem.text === 'Continue') {
                this.scene.stop();
                this.scene.resume(menuItem.scene);

            }
            if(menuItem.scene && menuItem.text === 'Exit') {
                this.scene.stop('PlayScene');
                this.scene.start('MenuScene');
            }
        });
    }

}

export default PauseScene;
