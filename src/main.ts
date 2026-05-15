import Phaser from 'phaser';
import Player from './player.ts';

// 1. On définit la scène
export default class MyGame extends Phaser.Scene {

    private player!: Player
    private bords!: Phaser.Physics.Arcade.StaticGroup;

    constructor() {
        super('game-scene'); // Un nom unique pour identifier ta scène
    }

    preload() {
        this.load.image('sol', 'assets/sol2.png');
        this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
        this.load.image('bord_hori', 'assets/bord_horizontal.png');
        this.load.image('bord_vert', 'assets/bord_vertical.png');
    }

    create() {
        // Décor
        this.add.image(0, 0, 'sol').setOrigin(0,0);

        // Le Joueur
        this.player = new Player(this,200,200,"dude");

        // Mur exterieur
        this.bords = this.physics.add.staticGroup();
        this.bords.create(0, 0, 'bord_hori').setOrigin(0,0).refreshBody();
        this.bords.create(978/2+32, 0, 'bord_hori').setOrigin(0,0).refreshBody();
        this.bords.create(0, 550-32, 'bord_hori').setOrigin(0,0).refreshBody();
        this.bords.create(978/2+32, 550-32, 'bord_hori').setOrigin(0,0).refreshBody();
        this.bords.create(0, 0, 'bord_vert').setOrigin(0,0).refreshBody();
        this.bords.create(0, 550/2+32, 'bord_vert').setOrigin(0,0).refreshBody();
        this.bords.create(978-32, 0, 'bord_vert').setOrigin(0,0).refreshBody();
        this.bords.create(978-32, 550/2+32, 'bord_vert').setOrigin(0,0).refreshBody();
    
        // Colision
        this.physics.add.collider(this.player, this.bords);
    }

    update() {
        this.player.update();
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
            debug: true
        }
    }
};

// 3. Initialisation
new Phaser.Game(config);