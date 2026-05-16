import Phaser from 'phaser';
import Arme from './arme/Arme';

export default class Player extends Phaser.Physics.Arcade.Sprite {
    // Le joueur possède ses propres touches de clavier
    private keyQ!: Phaser.Input.Keyboard.Key;
    private keyD!: Phaser.Input.Keyboard.Key;
    private keyZ!: Phaser.Input.Keyboard.Key;
    private keyS!: Phaser.Input.Keyboard.Key;
    private keySPACE!: Phaser.Input.Keyboard.Key;
    private keyC!: Phaser.Input.Keyboard.Key;

    private armes: Arme[];
    private arme_equiped: Arme;
    private time_tire:number = 0;

    private regard_x:number = 1;
    private regard_y:number = 0;

    public vie:number = 100;
    public name:string = "joueur1";
    private invincible:boolean = false
    private groupeBalles!: Phaser.Physics.Arcade.Group;

    constructor(scene: Phaser.Scene,Groupe_balle:Phaser.Physics.Arcade.Group,name:string, x: number, y: number, skin:string, num:number) {
        // "super" appelle le constructeur du Sprite avec la scène, les coordonnées et la clé de l'image ('dude')
        super(scene, x, y, skin);

        // --- MAGIE REQUISE ---
        // Contrairement à "scene.physics.add.sprite", créer une classe avec "new"
        // ne l'ajoute pas automatiquement à l'écran. Il faut le faire manuellement :
        scene.add.existing(this);         // Pour l'afficher à l'écran
        scene.physics.add.existing(this); // Pour lui donner un corps physique
        this.groupeBalles = Groupe_balle;

        // --- CONFIGURATION DU JOUEUR ---
        this.setCollideWorldBounds(true);

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
        this.armes=[new Arme(scene,Groupe_balle, "Pisolet",375,0,1,500)]
        this.arme_equiped = this.armes[0]
        this.name = name
        
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
            } else if (this.keyD.isDown) {
                move_x = 1
            }
            if (this.keyZ.isDown) {
                move_y = -1
            } else if (this.keyS.isDown) {
                move_y = 1
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
                    this.arme_equiped.tirer(this.name,this.x,this.y,this.regard_x,this.regard_y)
                    this.time_tire = this.scene.time.now
                }
            }
            if (Phaser.Input.Keyboard.JustDown(this.keyC)){
                if (this.armes.length > 1){
                    this.arme_equiped = this.armes[1]
                    console.log(`arme equiper est ${this.arme_equiped.nom}`)
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
        })
    }
    public debloquerArme(nom: string,portee:number,rarete:number, cadence: number): void {
        this.armes.push(new Arme(this.scene,this.groupeBalles,nom,portee,rarete,1,cadence))
    }
}