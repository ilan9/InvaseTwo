import Phaser from 'phaser';
import Arme from './arme/Arme';
import Shotgun from './arme/Shotgun';
import Barrel from './arme/Barrel';
import Wall from './arme/Wall';
import Mine from './arme/Mine';
import Grenade from './arme/Grenade';
import Lance_roquette from './arme/Roquette';

import type { DonneesArme } from './annexes/interface_type';
import ConsoleJoueur from './console';


export default class Player extends Phaser.Physics.Arcade.Sprite {
    // Le joueur possède ses propres touches de clavier
    private keyQ!: Phaser.Input.Keyboard.Key;
    private keyD!: Phaser.Input.Keyboard.Key;
    private keyZ!: Phaser.Input.Keyboard.Key;
    private keyS!: Phaser.Input.Keyboard.Key;
    private keySPACE!: Phaser.Input.Keyboard.Key;
    private keyC!: Phaser.Input.Keyboard.Key;
    private skin!: string

    public armes: Arme[];
    public arme_equiped: Arme;
    private time_tire:number = 0;

    public console:ConsoleJoueur

    private regard_x:number = 1;
    private regard_y:number = 0;

    public vie:number = 100;
    public name:string = "joueur1";
    private invincible:boolean = false
    private groupeBalles!: Phaser.Physics.Arcade.Group;

    constructor(scene: Phaser.Scene,Groupe_balle:Phaser.Physics.Arcade.Group,name:string, x: number, y: number, skin:string, num:number) {
        // "super" appelle le constructeur du Sprite avec la scène, les coordonnées et la clé de l'image (`${this.skin}')
        super(scene, x, y, skin);

        // --- MAGIE REQUISE ---
        // Contrairement à "scene.physics.add.sprite", créer une classe avec "new"
        // ne l'ajoute pas automatiquement à l'écran. Il faut le faire manuellement :
        scene.add.existing(this);         // Pour l'afficher à l'écran
        scene.physics.add.existing(this); // Pour lui donner un corps physique
        this.groupeBalles = Groupe_balle;

        this.skin = skin
        // --- CONFIGURATION DU JOUEUR ---
        this.setCollideWorldBounds(true);
        this.setDepth(10)
        this.setScale(2)

        // Console
        if (num==1){
            this.console = new ConsoleJoueur(scene, 10, 500);
        }else{
            this.console = new ConsoleJoueur(scene, 750, 500);
        }
        
        // On initialise le clavier directement DANS le joueur
        if (scene.input.keyboard) {
            if(num==1){
            this.keyQ = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
            this.keyD = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
            this.keyZ = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
            this.keyS = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
            this.keySPACE = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
            this.keyC = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);
            }else{
            this.keyQ = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
            this.keyD = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
            this.keyZ = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
            this.keyS = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
            this.keySPACE = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
            this.keyC = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L);
            }
        }
        this.armes=[new Arme(scene,Groupe_balle, "Pistolet",375,1,500)]
        this.arme_equiped = this.armes[0]
        this.name = name
        this.console.affiche_stoque(this.arme_equiped.nom,Infinity,Infinity)
    }
    
    /**
     * Cette méthode remplace tout le code de déplacement que tu avais dans MyGame
     */
    update(): void {
        // On stoppe le joueur par défaut
        if (this.vie > 0){
            this.setVelocityX(0);
            this.setVelocityY(0);
            let move_x:number = 0
            let move_y:number = 0

            // Déplacements
            if (this.keyQ.isDown) {
                move_x = -1
                this.anims.play(`${this.skin}_left`,true)
            } else if (this.keyD.isDown) {
                move_x = 1
                this.anims.play(`${this.skin}_right`,true)
            }
            if (this.keyZ.isDown) {
                move_y = -1
                this.anims.play(`${this.skin}_up`,true)
            } else if (this.keyS.isDown) {
                move_y = 1
                this.anims.play(`${this.skin}_down`,true)
            }
            this.setVelocityX(move_x*160);
            this.setVelocityY(move_y*160);

            // Direction si immobile
            if (move_x !== 0 || move_y !== 0) {
                this.regard_x = move_x;
                this.regard_y = move_y;
            }

            // Shoot
            if (this.keySPACE.isDown){
                if (this.scene.time.now - this.time_tire >= this.arme_equiped.cadence){// cadence en ms
                    this.arme_equiped.tirer(this,this.x,this.y,this.regard_x,this.regard_y)
                    this.time_tire = this.scene.time.now
                }
            }
            if (Phaser.Input.Keyboard.JustDown(this.keyC)){
                console.log("pas d'arme")
                if (this.armes.length > 1){
                    let indice_actu =  this.armes.indexOf(this.arme_equiped)
                    let indice_pro = (indice_actu+1) % this.armes.length
                    this.arme_equiped = this.armes[indice_pro]
                    console.log(`arme equiper est ${this.arme_equiped.nom}`)
                    this.console.ajouterMessage(`Arme equiper : ${this.arme_equiped.nom}`,"#00ff80")
                    this.console.affiche_stoque(this.arme_equiped.nom,this.arme_equiped.stoque,this.arme_equiped.stoquage[this.arme_equiped.cpt_stoque-1])
                }else{
                    this.console.ajouterMessage("Vous n'avez que le Pistolet","#00ff80") 
                }
            }
        }
    }
    degat(degat: number): void {
        //  LE BOUCLIER : Si je suis mort OU invincible, je bloque les dégâts !
        if (this.vie <= 0 || this.invincible === true) {
            return;
        }
        // les dégâts
        this.vie += degat;
        this.console.ajouterMessage(`Joueur a pris ${degat}, il lui reste ${this.vie}PV`,"#ff0000")
        console.log(`Joueur a pris ${degat}, il lui reste ${this.vie}PV`);

        if (this.vie <= 0) {
            this.mort();
        } else {
            this.invincible = true;
            this.setTint(0xff0000); // (Bonus) Le joueur devient rouge pour montrer qu'il a mal !
            
            this.scene.time.delayedCall(500, () => {
                this.invincible = false; // Le bouclier se désactive
                this.clearTint();           // Il reprend sa couleur normale
            });
        }
    }
    mort():void {
        console.log("joueur est mort")
        this.console.ajouterMessage("Vous êtes mort, vous ","#ece800")
        this.console.ajouterMessage("réapparaitrez dans 30 sec.","#ece800")
        this.console.affiche_stoque("Pistolet",Infinity,Infinity)
        const x = this.x
        const y = this.y
        this.disableBody(true,true)
        this.setVisible(false);
        this.setActive(false);
        this.scene.time.delayedCall(30000,()=>{
            this.enableBody(true,x,y,true,true)
            this.setVisible(true);
            this.setActive(true);
            this.vie = 100
            this.armes = [this.armes[0]]; 
            this.arme_equiped = this.armes[0];
        } )
    }
    public debloquerArme(nom: string,portee:number, cadence: number): void {
        if (nom == "Shotgun"){
            console.log("c'est un shotgun");
           this.armes.push(new Shotgun(this.scene,this.groupeBalles,portee,1,cadence)) 
        }else if (nom == "Barrel"){
            console.log("c'est un barrel");
           this.armes.push(new Barrel(this.scene,this.groupeBalles,portee,1,cadence)) 
        }else if (nom == "Mine"){
            console.log("c'est une mine");
           this.armes.push(new Mine(this.scene,this.groupeBalles,portee,1,cadence)) 
        }else if (nom == "Wall"){
            console.log("c'est un wall");
           this.armes.push(new Wall(this.scene,this.groupeBalles,portee,1,cadence)) 
        }else if (nom == "Grenade"){
            console.log("c'est une grenade");
           this.armes.push(new Grenade(this.scene,this.groupeBalles,portee,1,cadence)) 
        }else if (nom == "Lance_roquette"){
            console.log("c'est un lance roquette");
           this.armes.push(new Lance_roquette(this.scene,this.groupeBalles,portee,1,cadence)) 
        }
        else{
        this.armes.push(new Arme(this.scene,this.groupeBalles,nom,portee,1,cadence))
        }
        if(this.vie>0){
            console.log(`debloquer ${nom}`)
            this.console.ajouterMessage(`Vous avez débloquer ${nom}.`)
        }
    }
    public recup_arme(numero_vague: number, data: Record<string, DonneesArme>): void {
        Object.keys(data).forEach(vagueStr => {
            if (Number(vagueStr) <= numero_vague) {

                let infosNouvelleArme = data[vagueStr];
                let possedeDeja = this.armes.some(armeExistante => armeExistante.nom === infosNouvelleArme.nom);// .some renvoie true si joueur possede deja cette arme
                
                if (!possedeDeja) {// S'il ne l'a pas...
                    this.debloquerArme(infosNouvelleArme.nom, infosNouvelleArme.portee, infosNouvelleArme.cadence);
                    console.log(`Arme récupérée : ${infosNouvelleArme.nom}`);
                }
            }
        });
    }
}