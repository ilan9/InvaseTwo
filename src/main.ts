import Phaser from 'phaser';
import Player from './Joueur';
import Monstre from './Monstre';
import GestionnaireVagues from './survie/gestionnaire_vague';

// 1. On définit la scène
export default class MyGame extends Phaser.Scene {

    private player!: Player
    private player2!: Player
    private bords!: Phaser.Physics.Arcade.StaticGroup;
    private groupeBalles!: Phaser.Physics.Arcade.Group;
    private groupeJoueur!:Phaser.Physics.Arcade.Group;
    private groupeMonstre!:Phaser.Physics.Arcade.Group;
    private gestionnaireVagues!: GestionnaireVagues;

    constructor() {
        super('game-scene'); // Un nom unique pour identifier ta scène
    }

    preload() {
        this.load.image('sol', 'assets/sol2.png');
        this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
        this.load.spritesheet('zombie', 'assets/zombie.png', { frameWidth: 64, frameHeight: 96 });
        this.load.image('bord_hori', 'assets/bord_horizontal.png');
        this.load.image('bord_vert', 'assets/bord_vertical.png');
        this.load.json('donnees_vagues', 'assets/vague.json');
    }

    create() {
        // Décor
        this.add.image(0, 0, 'sol').setOrigin(0,0);

        // Le Joueur
        this.groupeBalles = this.physics.add.group();
        this.groupeJoueur = this.physics.add.group();
        this.player = new Player(this,this.groupeBalles,"joueur1",150,200,"dude",1);
        this.player2 = new Player(this,this.groupeBalles,"joueur2",500,200,"dude",2);
        this.groupeJoueur.add(this.player);
        this.groupeJoueur.add(this.player2);

        // Les Monstres
        this.groupeMonstre = this.physics.add.group();
        this.gestionnaireVagues = new GestionnaireVagues(this, this.groupeMonstre);
        this.gestionnaireVagues.lancerNouvelleVague();

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
        // Mur
        this.physics.add.collider(this.groupeJoueur, this.bords);
        this.physics.add.collider(this.groupeMonstre, this.bords);
        this.physics.add.overlap(this.groupeBalles, this.bords,(balle,_)=>{balle.destroy()});

        // Balle
        this.physics.add.overlap(this.groupeBalles, this.groupeJoueur, (balleObj, joueurObj) => {
            const balle_tire = balleObj as Phaser.GameObjects.Rectangle
            const joueurTouche = joueurObj as Player; 
            const degatsInfliges = balle_tire.getData('degat');
            const joueur_immu = balle_tire.getData("joueur");
            if (joueurTouche.name != joueur_immu){
            joueurTouche.degat(-1*degatsInfliges);
            balleObj.destroy();
            }})
        this.physics.add.overlap(this.groupeMonstre,this.groupeBalles ,(monstreObj,balleObj) => {
            const balle_tire = balleObj as Phaser.GameObjects.Rectangle
            const monstre = monstreObj as Monstre; 
            const degatsInfliges = balle_tire.getData('degat');
            monstre.degat(degatsInfliges);
            balleObj.destroy();
            }
        );
        // Monstre
        this.physics.add.overlap(this.groupeMonstre,this.groupeJoueur,(monstreObj,joueurObj)=>{
            const joueur = joueurObj as Player;
            const monstre = monstreObj as Monstre;
            monstre.attaquer(joueur);
        })
        this.physics.add.collider(this.groupeMonstre, this.groupeMonstre);

    }

    update() {
        this.player.update();
        this.player2.update();
        
        // Monstre
        this.groupeMonstre.getChildren().forEach((element) => {
            let zombie = element as Monstre
            if (zombie.active){zombie.update(this.player,this.player2)}
        });

        this.gestionnaireVagues.update();
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