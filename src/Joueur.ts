import Phaser from 'phaser';

export default class Player extends Phaser.Physics.Arcade.Sprite {
    // Le joueur possède ses propres touches de clavier
    private keyQ!: Phaser.Input.Keyboard.Key;
    private keyD!: Phaser.Input.Keyboard.Key;
    private keyZ!: Phaser.Input.Keyboard.Key;
    private keyS!: Phaser.Input.Keyboard.Key;

    constructor(scene: Phaser.Scene, x: number, y: number, skin:string, num:integer) {
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
            if(num==1){
            this.keyQ = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
            this.keyD = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
            this.keyZ = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
            this.keyS = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
            }else{
            this.keyQ = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
            this.keyD = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
            this.keyZ = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
            this.keyS = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
            }
        }
    }

    /**
     * Cette méthode remplace tout le code de déplacement que tu avais dans MyGame
     */
    update(): void {
        // On stoppe le joueur par défaut
        this.setVelocity(0);

        // Déplacements
        if (this.keyQ.isDown) {
            this.setVelocityX(-160);
        } else if (this.keyD.isDown) {
            this.setVelocityX(160);
        }

        if (this.keyZ.isDown) {
            this.setVelocityY(-160);
        } else if (this.keyS.isDown) {
            this.setVelocityY(160);
        }
    }
}