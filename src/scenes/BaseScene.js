import Phaser from 'phaser';

class BaseScene extends Phaser.Scene{
    constructor(key, config) {
        super(key);
        this.config = config;
        this.screenCenter = [config.width / 2, config.height / 2];
    }
    create(){
        this.add.image(0, 0, "sky").setOrigin(0);

        if(this.config.canGoBack) {
            const backButton = this.add.image(this.config.width - 450 ,this.config.height - 540, 'back')
                .setOrigin(1)
                .setScale(0.1)
                .setInteractive();
            backButton.on('pointerup' , () => {
                this.scene.start('MenuScene');
            })
        }
    }

    // Constructor for menu creation in base class.

    createMenu(menu, menuEvents){
        let lastMenuPosY = 0;

        menu.forEach(menuItem =>{
            const menuPos = [this.screenCenter[0], this.screenCenter[1] + lastMenuPosY];
           menuItem.textGameObject = this.add.text(...menuPos, menuItem.text , {fontSize : '32px', fill:'#00000f'}).setOrigin(0.5, 1);
            lastMenuPosY += 42;
            menuEvents(menuItem);
        })
    }
}

export default BaseScene;
