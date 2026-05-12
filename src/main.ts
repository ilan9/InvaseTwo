import Phaser from 'phaser';

// On définit une scène
class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    preload() {
        // Charge une image de test depuis les serveurs de Phaser
        this.load.image('logo', 'https://labs.phaser.io/assets/sprites/phaser3-logo.png');
    }

    create() {
        // Affiche le logo au milieu
        const logo = this.add.image(400, 150, 'logo');

        // Ajoute un petit message stylé
        this.add.text(400, 400, "MON JEU EST EN LIGNE !", {
            fontSize: '40px',
            color: '#00ff00'
        }).setOrigin(0.5);

        // Petit effet : fait rebondir le logo
        this.tweens.add({
            targets: logo,
            y: 450,
            duration: 2000,
            ease: 'Power2',
            yoyo: true,
            loop: -1
        });
    }
}

// Configuration du jeu
const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'app', // S'injecte dans la div id="app" de ton index.html
    scene: GameScene
};

new Phaser.Game(config);