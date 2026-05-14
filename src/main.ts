import Phaser from 'phaser';

// 1. On définit la scène
export default class MyGame extends Phaser.Scene {

     private player!: Phaser.Physics.Arcade.Sprite;

    constructor() {
        super('game-scene'); // Un nom unique pour identifier ta scène
    }

    preload() {
        this.load.image('sky', 'assets/sky.png');
        this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
    }

    create() {
        // Le Joueur
        this.player = this.physics.add.sprite(100, 450, 'dude');
        this.player.setCollideWorldBounds(true);
    }

    update() {
    }
}

// 2. Configuration du jeu
const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 1200,
    height: 675,
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