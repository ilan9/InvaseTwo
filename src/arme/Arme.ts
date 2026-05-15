
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
    // Ajoute d'autres propriétés ici (degats, cadence, etc.)

    // --- 2. LE CONSTRUCTEUR (L'usine de fabrication) ---
    // Cette fonction est appelée automatiquement quand tu crées une NOUVELLE arme.
    // C'est ici que tu reçois les valeurs de base pour remplir tes propriétés.
    constructor(nom: string, portee: number, rarete: integer, level:integer, cadence:integer) {
        this.nom = nom;
        this.portee = portee;
        this.rarete = rarete;
        this.cadence = cadence;

        this.recul = level*5;
        this.degat = level*10;
        this.level = level
    }

    // --- 3. LES MÉTHODES (Ce que l'arme peut faire) ---
    // Tu crées ici les fonctions propres à l'arme.
    public tirer(dep_x:number,dep_y:number,direction:string) {
        // C'est ici que tu mettras ta logique pour faire apparaître un projectile !
        console.log(`Tire avec ${this.nom} depuis ${dep_x}${dep_y} en direction: ${direction}.`);
    }
}