
export default class Arme {
    // --- 1. LES PROPRIÉTÉS (Les caractéristiques de l'arme) ---
    // Tu déclares ici les variables qui appartiendront à chaque arme.
    // "public" veut dire que le joueur pourra lire cette info.
    public nom: string;
    public portee: number;
    public rarete: integer;
    public recul: integer;
    public degat: integer;
    public cadence: integer;
    public level:integer;

    private groupe_balle:Phaser.Physics.Arcade.Group;

    private scene: Phaser.Scene;
    // Ajoute d'autres propriétés ici (degats, cadence, etc.)

    // --- 2. LE CONSTRUCTEUR (L'usine de fabrication) ---
    // Cette fonction est appelée automatiquement quand tu crées une NOUVELLE arme.
    // C'est ici que tu reçois les valeurs de base pour remplir tes propriétés.
    constructor(scene:Phaser.Scene,groupe_balle:Phaser.Physics.Arcade.Group, nom: string, portee: number, rarete: integer, level:integer, cadence:integer) {
        this.scene = scene
        this.nom = nom;
        this.portee = portee;
        this.rarete = rarete;
        this.cadence = cadence;

        this.recul = level*5;
        this.degat = level*10;
        this.level = level
        this.groupe_balle = groupe_balle
    }

    // --- 3. LES MÉTHODES (Ce que l'arme peut faire) ---
    // Tu crées ici les fonctions propres à l'arme.
    public tirer(joueur_name:string, dep_x:number,dep_y:number,move_x:number,move_y:number) {
        //console.log(`Tire avec ${this.nom} depuis ${dep_x}${dep_y} en direction: ${move_x},${move_y}.`);

        // Création de la balle
        const balle = this.scene.add.image(dep_x,dep_y,'balle_pistol');
        balle.setScale(0.05)
        balle.setRotation(Math.atan2(move_y, move_x) + Phaser.Math.DegToRad(90));//pour la rotation et on ajoute 1/4
        this.scene.physics.add.existing(balle);
        const corpsBalle = balle.body as Phaser.Physics.Arcade.Body;
        balle.setData("degat",this.degat)
        balle.setData("joueur",joueur_name)
        this.groupe_balle.add(balle)

        // Déplacer la balle
        const vitesse_balle = 400
        corpsBalle.setVelocity(move_x * vitesse_balle, move_y * vitesse_balle);
        
        // Porté de la balle
        const dure_vie = (this.portee / vitesse_balle) * 1000;
        console.log(dure_vie)
        this.scene.time.delayedCall(dure_vie,()=>{
            if (balle.active){balle.destroy()}
        })

    }
}