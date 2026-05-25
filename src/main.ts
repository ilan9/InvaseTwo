import Phaser from 'phaser';
import Player from './Joueur';
import Monstre from './Monstre';
import GestionnaireVagues from './survie/gestionnaire_vague';
import type { DonneesArme } from './annexes/interface_type';


// 1. On définit la scène
export default class MyGame extends Phaser.Scene {

    private player!: Player
    private player2!: Player
    private bords!: Phaser.Physics.Arcade.StaticGroup;
    private groupeBalles!: Phaser.Physics.Arcade.Group;
    private groupeBarrel!: Phaser.Physics.Arcade.StaticGroup;
    private groupeMine!: Phaser.Physics.Arcade.StaticGroup;
    private groupeJoueur!:Phaser.Physics.Arcade.Group;
    private groupeMonstre!:Phaser.Physics.Arcade.Group;
    private gestionnaireVagues!: GestionnaireVagues;

    constructor() {
        super('game-scene'); // Un nom unique pour identifier ta scène
    }

    preload() {
        this.load.image('sol', 'assets/img/sol2.png');
        this.load.spritesheet('dude', 'assets/img/joueur1.png', { frameWidth: 32, frameHeight: 48 });
        this.load.spritesheet('dude2', 'assets/img/dude.png', { frameWidth: 32, frameHeight: 48 });
        this.load.spritesheet('zombie', 'assets/img/zombie1.png', { frameWidth: 64, frameHeight: 96 });
        this.load.image('bord_hori', 'assets/img/bord_horizontal.png');
        this.load.image('bord_vert', 'assets/img/bord_vertical.png');
        this.load.json('donnees_vagues', 'assets/json/vague.json');
        this.load.json('data_arme', 'assets/json/arme.json');
        this.load.image('balle_pistol', 'assets/img/balle_pistol.png');
        this.load.image('barrel', 'assets/img/barrel.png');
        this.load.image('mine', 'assets/img/mine.png');
        this.load.spritesheet('explosion', 'assets/img/explosion3.png', { frameWidth: 384/8, frameHeight: 48 });
    }

    create() {
        // Décor
        this.add.image(0, 0, 'sol').setOrigin(0,0);

        // Animation
        this.anims.create({
            key: 'anim_boom', // Le nom secret de l'animation
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 7 }), // S'il y a 9 images (de 0 à 8)
            frameRate: 15, // Vitesse de l'animation (15 images par seconde)
            repeat: 0, // 0 = L'animation ne se joue qu'une seule fois
            hideOnComplete: true // MAGIQUE : Le sprite devient invisible tout seul à la fin !
        });

        // Les Monstres
        this.groupeMonstre = this.physics.add.group();
        this.gestionnaireVagues = new GestionnaireVagues(this, this.groupeMonstre);
        this.gestionnaireVagues = new GestionnaireVagues(this, this.groupeMonstre);
        
        // On met le jeu en attente du bouton HTML
        window.addEventListener('demarrer-jeu', () => {
            // Le joueur a cliqué sur "JOUER", on lance le massacre !
            this.gestionnaireVagues.lancerNouvelleVague();
        }, { once: true }); 
        // Le "{ once: true }" est une sécurité magique : Phaser n'écoutera ce message qu'une seule fois, 
        // ce qui empêche de lancer la vague 1 plusieurs fois si le joueur clique comme un fou.

        // Le Joueur
        this.groupeBalles = this.physics.add.group();
        this.groupeBarrel = this.physics.add.staticGroup();
        this.groupeMine = this.physics.add.staticGroup();

        this.groupeJoueur = this.physics.add.group();
        this.player = new Player(this,this.groupeBalles,"joueur1",150,200,"dude",1);
        this.player2 = new Player(this,this.groupeBalles,"joueur2",500,200,"dude",2);
        this.groupeJoueur.add(this.player);
        this.groupeJoueur.add(this.player2);

        // Les armes
        this.events.on('changement-vague', (numeroVague: number) => {
            this.groupeJoueur.getChildren().forEach(element => {
                let joueur = element as Player
                let data = this.cache.json.get('data_arme') as Record <string, DonneesArme>;
                let arme = data[String(numeroVague)]
                joueur.armes.forEach(arme_poss=> {
                    arme_poss.levelup_arme(numeroVague)
                });
                if(arme){
                joueur.debloquerArme(arme.nom,arme.portee,arme.cadence)}
                joueur.recup_arme(numeroVague,data)
                joueur.console.affiche_stoque(joueur.arme_equiped.nom,joueur.arme_equiped.stoque,joueur.arme_equiped.stoquage[joueur.arme_equiped.cpt_stoque-1])
            })
                
            });

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
            const balle_tire = balleObj as Phaser.GameObjects.Image
            const joueurTouche = joueurObj as Player; 
            const degatsInfliges = balle_tire.getData('degat');
            const joueur_immu = balle_tire.getData("joueur");
            if (joueurTouche.name != joueur_immu){
            joueurTouche.degat(-1*degatsInfliges);
            balleObj.destroy();
            }})
        this.physics.add.overlap(this.groupeMonstre,this.groupeBalles ,(monstreObj,balleObj) => {
            const balle_tire = balleObj as Phaser.GameObjects.Image
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


        //      Les armes posable
        
        // Barrel
        this.events.on('create_barrel', (barrel: Phaser.Physics.Arcade.Sprite) => {
            this.groupeBarrel.add(barrel)
        })
        this.physics.add.collider(this.groupeJoueur,this.groupeBarrel)
        this.physics.add.collider(this.groupeJoueur,this.groupeBarrel)
        this.physics.add.overlap(this.groupeBalles,this.groupeBarrel,(balleObj,barrelObj)=>{
            let barrel_explo = barrelObj as Phaser.Physics.Arcade.Sprite
            this.explosion(barrel_explo);
            balleObj.destroy()
        })

         // Mine
        this.events.on('create_mine', (mine: Phaser.Physics.Arcade.Sprite) => {
            this.groupeMine.add(mine)
        })
        this.physics.add.overlap(this.groupeJoueur,this.groupeMine,(jouObj,mineObj)=>{
            let mine_explo = mineObj as Phaser.Physics.Arcade.Sprite
            this.explosion(mine_explo);
            let joueur = jouObj as Player
            joueur.console.ajouterMessage("Vous avez marcher")
            joueur.console.ajouterMessage("sur une mine.")
        })
        this.physics.add.overlap(this.groupeMonstre,this.groupeMine,(_,mineObj)=>{
            let mine_explo = mineObj as Phaser.Physics.Arcade.Sprite
            this.explosion(mine_explo);
        })



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

    // Fonction Annexe
    private explosion(obj:Phaser.Physics.Arcade.Sprite):void{
        console.log(`${obj} a explosé en ${obj.x}`)
        obj.destroy()
        // Animation
        let boom = this.add.sprite(obj.x, obj.y, 'explosion');
        
        // (Optionnel) Tu peux l'agrandir si l'explosion est trop petite
        boom.setScale(2.5); 
        // 2. On lance l'animation !
        boom.play('anim_boom');

        // On inflige les degats
        let degat = -100

        this.groupeJoueur.getChildren().forEach((joueurObj)=>{
            let joueur = joueurObj as Player
            if(Phaser.Math.Distance.Between( joueur.x, joueur.y,obj.x, obj.y) <= 100){
                joueur.degat(degat)
            }
        })

        this.groupeMonstre.getChildren().forEach((monstreObj)=>{
            let monstre = monstreObj as Monstre
            if(Phaser.Math.Distance.Between( monstre.x, monstre.y,obj.x, obj.y) <= 100){
                monstre.degat(-1*degat)
            }
        })

        this.groupeBarrel.getChildren().forEach((barrelObj)=>{
            let barrel = barrelObj as Phaser.Physics.Arcade.Sprite
            if(barrel!== obj && Phaser.Math.Distance.Between( barrel.x, barrel.y,obj.x, obj.y) <= 50){
                this.time.delayedCall(500,()=>{
                this.explosion(barrel)
                })
            }
        })
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