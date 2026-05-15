// Fichier : src/Arme.ts

export default class Arme {
    // --- 1. LES PROPRIÉTÉS (Les caractéristiques de l'arme) ---
    // Tu déclares ici les variables qui appartiendront à chaque arme.
    // "public" veut dire que le joueur pourra lire cette info.
    public portee: number;
    public rarete: integer;
    public recul: integer;
    public degat: integer;
    public cadence: integer;
    // Ajoute d'autres propriétés ici (degats, cadence, etc.)

    // --- 2. LE CONSTRUCTEUR (L'usine de fabrication) ---
    // Cette fonction est appelée automatiquement quand tu crées une NOUVELLE arme.
    // C'est ici que tu reçois les valeurs de base pour remplir tes propriétés.
    constructor(portee: number, rarete: integer, recul:integer, degat:integer, cadence:integer) {
        this.portee = portee;
        this.rarete = rarete;
        this.recul = recul;
        this.degat = degat;
        this.cadence = cadence;
    }

    // --- 3. LES MÉTHODES (Ce que l'arme peut faire) ---
    // Tu crées ici les fonctions propres à l'arme.
    public tirer() {
        // C'est ici que tu mettras ta logique pour faire apparaître un projectile !
        console.log(`Pew pew ! Tir d'une arme ${this.rarete} avec une portée de ${this.portee}`);
    }
}