import Phaser from 'phaser';

export default class MenuScene extends Phaser.Scene {
    // Les variables pour stocker les choix (par défaut, ils sont tous les deux 'dude')
    private skinJ1: string = 'dude';
    private skinJ2: string = 'dude';

    // La liste de tes skins disponibles
    private skinsDispo: string[] = ['dude', 'zombie', 'diable'];

    // Les "boîtes" qui vont contenir nos différents menus
    private ecranSelection!: Phaser.GameObjects.Container;
    private ecranControles!: Phaser.GameObjects.Container;

    // Tableaux pour garder en mémoire les boutons et changer leurs couleurs
    private btnsJ1: Phaser.GameObjects.Text[] = [];
    private btnsJ2: Phaser.GameObjects.Text[] = [];

    constructor() {
        super('menu-scene');
    }

    create() {
        // Le Titre du jeu (il reste affiché tout le temps, donc on ne le met pas dans une boîte)
        this.add.text(978 / 2, 80, 'InvaseTwo', {
            fontSize: '60px',
            fontFamily: 'Arial', // Tu pourras mettre ta police Nosifer plus tard !
            color: '#ff0000',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // 1. Création des deux écrans
        this.ecranSelection = this.add.container(0, 0);
        this.ecranControles = this.add.container(0, 0);

        // Par défaut, on cache l'écran des contrôles
        this.ecranControles.setVisible(false);

        // 2. On remplit ces écrans
        this.creerMenuSelection();
        this.creerMenuControles();
    }

    // ==========================================
    // ÉCRAN 1 : LA SÉLECTION DES SKINS
    // ==========================================
    private creerMenuSelection() {
        // Titres Joueur 1 et Joueur 2
        this.ecranSelection.add(this.add.text(250, 180, 'JOUEUR 1', { fontSize: '30px', color: '#00aaff' }).setOrigin(0.5));
        this.ecranSelection.add(this.add.text(978 - 250, 180, 'JOUEUR 2', { fontSize: '30px', color: '#ffaa00' }).setOrigin(0.5));

        // Création des boutons de skins pour J1
        let yPos = 250;
        this.skinsDispo.forEach((skin) => {
            let btn = this.add.text(250, yPos, skin.toUpperCase(), { fontSize: '25px', color: '#ffffff' })
                .setOrigin(0.5)
                .setInteractive()
                .on('pointerdown', () => {
                    this.skinJ1 = skin;      // On sauvegarde le choix
                    this.majCouleursSkins(); // On met à jour les couleurs
                });
            this.btnsJ1.push(btn);
            this.ecranSelection.add(btn);
            yPos += 50;
        });

        // Création des boutons de skins pour J2
        yPos = 250;
        this.skinsDispo.forEach((skin) => {
            let btn = this.add.text(978 - 250, yPos, skin.toUpperCase(), { fontSize: '25px', color: '#ffffff' })
                .setOrigin(0.5)
                .setInteractive()
                .on('pointerdown', () => {
                    this.skinJ2 = skin;
                    this.majCouleursSkins();
                });
            this.btnsJ2.push(btn);
            this.ecranSelection.add(btn);
            yPos += 50;
        });

        // Appliquer les couleurs initiales (pour mettre en jaune 'dude' par défaut)
        this.majCouleursSkins();

        // Le bouton VALIDER (pour passer à l'écran suivant)
        const btnValider = this.add.text(978 / 2, 450, '[ VALIDER LES SKINS ]', { fontSize: '35px', color: '#00ff00' })
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerover', () => btnValider.setColor('#ffffff'))
            .on('pointerout', () => btnValider.setColor('#00ff00'))
            .on('pointerdown', () => {
                // MAGIE : On cache la sélection, on affiche les contrôles !
                this.ecranSelection.setVisible(false);
                this.ecranControles.setVisible(true);
            });
        this.ecranSelection.add(btnValider);
    }

    // Petite fonction pratique pour mettre en jaune le skin sélectionné et en blanc les autres
    private majCouleursSkins() {
        this.btnsJ1.forEach((btn, index) => {
            if (this.skinsDispo[index] === this.skinJ1) btn.setColor('#ffff00'); // Jaune si sélectionné
            else btn.setColor('#ffffff'); // Blanc sinon
        });

        this.btnsJ2.forEach((btn, index) => {
            if (this.skinsDispo[index] === this.skinJ2) btn.setColor('#ffff00');
            else btn.setColor('#ffffff');
        });
    }

    // ==========================================
    // ÉCRAN 2 : LES CONTRÔLES ET LE BOUTON JOUER
    // ==========================================
    private creerMenuControles() {
        // Titre de l'écran
        this.ecranControles.add(this.add.text(978 / 2, 180, 'CONTRÔLES', { fontSize: '40px', color: '#ffffff' }).setOrigin(0.5));

        // Texte des contrôles J1
        const texteJ1 = "JOUEUR 1 (Bleu)\n\nDéplacement : Z Q S D\nTirer : ESPACE\nChanger d'arme : C";
        this.ecranControles.add(this.add.text(250, 300, texteJ1, { fontSize: '20px', color: '#00aaff', align: 'center' }).setOrigin(0.5));

        // Texte des contrôles J2
        const texteJ2 = "JOUEUR 2 (Orange)\n\nDéplacement : FLÈCHES\nTirer : ENTRÉE\nChanger d'arme : L";
        this.ecranControles.add(this.add.text(978 - 250, 300, texteJ2, { fontSize: '20px', color: '#ffaa00', align: 'center' }).setOrigin(0.5));

        // Le bouton final JOUER
        const btnJouer = this.add.text(978 / 2, 450, '[ LANCER LA PARTIE ]', { fontSize: '40px', color: '#ff0000', fontStyle: 'bold' })
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerover', () => btnJouer.setColor('#ffffff'))
            .on('pointerout', () => btnJouer.setColor('#ff0000'))
            .on('pointerdown', () => {
                this.lancerJeu();
            });
        this.ecranControles.add(btnJouer);
    }

    // ==========================================
    // LANCEMENT DU JEU
    // ==========================================
    private lancerJeu() {
        console.log(`Lancement ! J1: ${this.skinJ1} | J2: ${this.skinJ2}`);
        
        // On envoie le "colis" à MyGame avec les deux skins choisis
        this.scene.start('game-scene', { 
            skinJoueur1: this.skinJ1, 
            skinJoueur2: this.skinJ2 
        });
    }
}