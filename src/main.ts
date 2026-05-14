import Phaser from 'phaser';

// 1. On définit la scène
export default class MyGame extends Phaser.Scene {

    private player!: Phaser.Physics.Arcade.Sprite;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private bords!: Phaser.Physics.Arcade.StaticGroup;

    constructor() {
        super('game-scene'); // Un nom unique pour identifier ta scène
    }

    preload() {
        this.load.image('sol', 'assets/sol1.png');
        this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
        this.load.image('bords', 'assets/platform.png');
    }

    create() {
        // Décor
        this.add.image(0, 0, 'sol').setOrigin(0,0);

        // Le Joueur
        this.player = this.physics.add.sprite(480, 250, 'dude');
        this.player.setCollideWorldBounds(true);

        // Entrées Clavier
        if (this.input.keyboard) {
            this.cursors = this.input.keyboard.createCursorKeys();
        }
        // Mur exterieur
        this.bords = this.physics.add.staticGroup();
        this.bords.create(0, 10, 'bords').setOrigin(0,0).setScale(1,1);
        this.bords.create(0, 525, 'bords').setOrigin(0,0).setScale(2,1);
        this.bords.create(16, 0, 'bords').setOrigin(0,0).setScale(2,1).setAngle(90);
        this.bords.create(978-8, 0, 'bords').setOrigin(0,0).setScale(2,1).setAngle(90);
        
    }

    update() {
        this.player.setVelocity(0);
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
        }
        if (this.cursors.up.isDown) {
            this.player.setVelocityY(-160);
        } else if (this.cursors.down.isDown) {
            this.player.setVelocityY(160);
        }
    }
}

// 2. Configuration du jeu
const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 978,
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