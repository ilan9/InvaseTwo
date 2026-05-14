import Phaser from 'phaser';

// 1. On définit la scène
export default class MyGame extends Phaser.Scene {
    constructor() {
        super('game-scene'); // Un nom unique pour identifier ta scène
    }

    preload() {
        // Chargement des assets (images, sons)
    }

    create() {
        this.load.spritesheet("dude","src/asset/dude.png");
        this.game.scale.startFullscreen();
        // Création des objets
        this.add.text(600, 300, "Phaser en TypeScript !", { 
            fontSize: '40px', 
            color: '#ffffff' 
        }).setOrigin(0.5);
    }

    update() {
        // Logique qui tourne en boucle
    }
}

// 2. Configuration du jeu
const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 1200,
    height: 550,
    parent: 'app',
    scene: MyGame, // On passe la classe ici
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    }
};

// 3. Initialisation
new Phaser.Game(config);