import Phaser from 'phaser';

// 1. On définit la scène
class MyGame extends Phaser.Scene {
    constructor() {
        super('game-scene'); // Un nom unique pour identifier ta scène
    }

    preload() {
        // Chargement des assets (images, sons)
    }

    create() {
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
    height: 600,
    parent: 'app',
    scene: MyGame, // On passe la classe ici
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 300 }, // Optionnel : pour ajouter de la gravité plus tard
            debug: false
        }
    }
};

// 3. Initialisation
new Phaser.Game(config);