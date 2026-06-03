import Phaser from 'phaser';

export default class MenuScene extends Phaser.Scene {
    // Les variables stockent maintenant un NOMBRE (1 par défaut)
    private skinJ1: number = 1;
    private skinJ2: number = 2; // On lui met 2 par défaut pour qu'ils soient différents

    private ecranSelection!: Phaser.GameObjects.Container;
    private ecranControles!: Phaser.GameObjects.Container;

    private btnsJ1: Phaser.GameObjects.Text[] = [];
    private btnsJ2: Phaser.GameObjects.Text[] = [];

    constructor() {
        super('menu-scene');
    }

    create() {
        this.add.text(978 / 2, 60, 'InvaseTwo', {
            fontSize: '60px',
            fontFamily: 'Arial', 
            color: '#ff0000',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.ecranSelection = this.add.container(0, 0);
        this.ecranControles = this.add.container(0, 0);
        this.ecranControles.setVisible(false);

        this.creerMenuSelection();
        this.creerMenuControles();
    }

    private creerMenuSelection() {
        // Titres Joueur 1 et Joueur 2
        this.ecranSelection.add(this.add.text(250, 150, 'JOUEUR 1', { fontSize: '30px', color: '#00aaff' }).setOrigin(0.5));
        this.ecranSelection.add(this.add.text(978 - 250, 150, 'JOUEUR 2', { fontSize: '30px', color: '#ffaa00' }).setOrigin(0.5));

        // --- MAGIE DE LA GRILLE ---
        // On fait une boucle qui compte de 1 à 32
        for (let i = 1; i <= 32; i++) {
            
            // Calcul mathématique pour faire 8 colonnes et 4 lignes
            let col = (i - 1) % 8;             // Donne un chiffre de 0 à 7
            let row = Math.floor((i - 1) / 8); // Donne la ligne (0, 1, 2 ou 3)

            // --- GRILLE JOUEUR 1 ---
            // On calcule la position X et Y en fonction de la colonne et de la ligne
            let xJ1 = 110 + col * 40; 
            let yJ1 = 200 + row * 40;
            
            let btnJ1 = this.add.text(xJ1, yJ1, i.toString(), { fontSize: '20px', color: '#ffffff' })
                .setOrigin(0.5)
                .setInteractive()
                .on('pointerdown', () => {
                    this.skinJ1 = i; // On sauvegarde le NUMÉRO du skin !
                    this.majCouleursSkins();
                });
            this.btnsJ1.push(btnJ1);
            this.ecranSelection.add(btnJ1);

            // --- GRILLE JOUEUR 2 ---
            let xJ2 = 590 + col * 40; 
            let yJ2 = 200 + row * 40;

            let btnJ2 = this.add.text(xJ2, yJ2, i.toString(), { fontSize: '20px', color: '#ffffff' })
                .setOrigin(0.5)
                .setInteractive()
                .on('pointerdown', () => {
                    this.skinJ2 = i;
                    this.majCouleursSkins();
                });
            this.btnsJ2.push(btnJ2);
            this.ecranSelection.add(btnJ2);
        }

        // On applique les couleurs pour afficher le choix de base
        this.majCouleursSkins();

        // Le bouton VALIDER
        const btnValider = this.add.text(978 / 2, 450, '[ VALIDER LES SKINS ]', { fontSize: '35px', color: '#00ff00' })
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerover', () => btnValider.setColor('#ffffff'))
            .on('pointerout', () => btnValider.setColor('#00ff00'))
            .on('pointerdown', () => {
                this.ecranSelection.setVisible(false);
                this.ecranControles.setVisible(true);
            });
        this.ecranSelection.add(btnValider);
    }

    private majCouleursSkins() {
        // Dans notre tableau btnsJ1, la case 0 correspond au skin 1, la case 1 au skin 2, etc.
        this.btnsJ1.forEach((btn, index) => {
            let numeroDuSkin = index + 1;
            if (numeroDuSkin === this.skinJ1) btn.setColor('#ffff00'); 
            else btn.setColor('#ffffff'); 
        });

        this.btnsJ2.forEach((btn, index) => {
            let numeroDuSkin = index + 1;
            if (numeroDuSkin === this.skinJ2) btn.setColor('#ffff00');
            else btn.setColor('#ffffff');
        });
    }

    private creerMenuControles() {
        this.ecranControles.add(this.add.text(978 / 2, 180, 'CONTRÔLES', { fontSize: '40px', color: '#ffffff' }).setOrigin(0.5));

        const texteJ1 = "JOUEUR 1 (Bleu)\n\nDéplacement : Z Q S D\nTirer : ESPACE\nChanger d'arme : C";
        this.ecranControles.add(this.add.text(250, 300, texteJ1, { fontSize: '20px', color: '#00aaff', align: 'center' }).setOrigin(0.5));

        const texteJ2 = "JOUEUR 2 (Orange)\n\nDéplacement : FLÈCHES\nTirer : ENTRÉE\nChanger d'arme : L";
        this.ecranControles.add(this.add.text(978 - 250, 300, texteJ2, { fontSize: '20px', color: '#ffaa00', align: 'center' }).setOrigin(0.5));

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

    private lancerJeu() {
        console.log(`Lancement ! J1: skin n°${this.skinJ1} | J2: skin n°${this.skinJ2}`);
        
        // On envoie les NOMBRES dans le colis !
        this.scene.start('game-scene', { 
            skinJoueur1: this.skinJ1, 
            skinJoueur2: this.skinJ2 
        });
    }
}