import Phaser from 'phaser';

export default class Player extends Phaser.Physics.Arcade.Sprite {
    // Le joueur possède ses propres touches de clavier
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

    constructor(scene: Phaser.Scene, x: number, y: number, skin:string) {
        // "super" appelle le constructeur du Sprite avec la scène, les coordonnées et la clé de l'image ('dude')
        super(scene, x, y, skin);

        // --- MAGIE REQUISE ---
        // Contrairement à "scene.physics.add.sprite", créer une classe avec "new"
        // ne l'ajoute pas automatiquement à l'écran. Il faut le faire manuellement :
        scene.add.existing(this);         // Pour l'afficher à l'écran
        scene.physics.add.existing(this); // Pour lui donner un corps physique

        // --- CONFIGURATION DU JOUEUR ---
        this.setCollideWorldBounds(true);

        // On initialise le clavier directement DANS le joueur
        if (scene.input.keyboard) {
            this.cursors = scene.input.keyboard.createCursorKeys();
        }
    }

    /**
     * Cette méthode remplace tout le code de déplacement que tu avais dans MyGame
     */
    update(): void {
        // On stoppe le joueur par défaut
        this.setVelocity(0);

        // Déplacements
        if (this.cursors.left.isDown) {
            this.setVelocityX(-160);
        } else if (this.cursors.right.isDown) {
            this.setVelocityX(160);
        }

        if (this.cursors.up.isDown) {
            this.setVelocityY(-160);
        } else if (this.cursors.down.isDown) {
            this.setVelocityY(160);
        }
    }
}