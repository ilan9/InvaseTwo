import Phaser from 'phaser';

export default class MenuScene extends Phaser.Scene {
    private skinJ1: number = 1;
    private skinJ2: number = 2; 

    private ecranSelection!: Phaser.GameObjects.Container;
    private ecranControles!: Phaser.GameObjects.Container;

    // ATTENTION : Ce ne sont plus des Text[], mais des Sprite[] !
    private btnsJ1: Phaser.GameObjects.Sprite[] = [];
    private btnsJ2: Phaser.GameObjects.Sprite[] = [];

    constructor() {
        super('menu-scene');
    }

    // --- 1. LE PRELOAD DU MENU ---
    // On doit charger les 32 skins pour pouvoir les dessiner dans la grille
    preload() {
        for (let i = 1; i <= 32; i++) {
            this.load.spritesheet(
                `skin_${i}`, 
                `assets/img/characters/character_${i}_frame16x20.png`, 
                { frameWidth: 16, frameHeight: 20 }
            );
        }
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
        this.ecranSelection.add(this.add.text(250, 150, 'JOUEUR 1', { fontSize: '30px', color: '#00aaff' }).setOrigin(0.5));
        this.ecranSelection.add(this.add.text(978 - 250, 150, 'JOUEUR 2', { fontSize: '30px', color: '#ffaa00' }).setOrigin(0.5));

        // --- MAGIE DE LA GRILLE AVEC DES SPRITES ---
        for (let i = 1; i <= 32; i++) {
            let col = (i - 1) % 8;             
            let row = Math.floor((i - 1) / 8); 

            // Espacement légèrement agrandi (45px et 55px) pour que les sprites ne se touchent pas
            let xJ1 = 90 + col * 45; 
            let yJ1 = 220 + row * 55;
            
            // On ajoute le SPRITE (le '1' à la fin permet d'afficher la frame 1, où le perso regarde vers le bas)
            let btnJ1 = this.add.sprite(xJ1, yJ1, `skin_${i}`, 1)
                .setScale(2) // On les grossit par défaut
                .setInteractive({ cursor: 'pointer' }) // Ajoute la petite main au survol
                .on('pointerdown', () => {
                    this.skinJ1 = i; 
                    this.majCouleursSkins();
                });
            this.btnsJ1.push(btnJ1);
            this.ecranSelection.add(btnJ1);

            // --- GRILLE JOUEUR 2 ---
            let xJ2 = 560 + col * 45; 
            let yJ2 = 220 + row * 55;

            let btnJ2 = this.add.sprite(xJ2, yJ2, `skin_${i}`, 1)
                .setScale(2)
                .setInteractive({ cursor: 'pointer' })
                .on('pointerdown', () => {
                    this.skinJ2 = i;
                    this.majCouleursSkins();
                });
            this.btnsJ2.push(btnJ2);
            this.ecranSelection.add(btnJ2);
        }

        this.majCouleursSkins();

        const btnValider = this.add.text(978 / 2, 470, '[ VALIDER LES SKINS ]', { fontSize: '35px', color: '#00ff00' })
            .setOrigin(0.5)
            .setInteractive({ cursor: 'pointer' })
            .on('pointerover', () => btnValider.setColor('#ffffff'))
            .on('pointerout', () => btnValider.setColor('#00ff00'))
            .on('pointerdown', () => {
                this.ecranSelection.setVisible(false);
                this.ecranControles.setVisible(true);
            });
        this.ecranSelection.add(btnValider);
    }

    private majCouleursSkins() {
        // Au lieu de setColor, on utilise setTint (couleur) et setScale (taille) !
        this.btnsJ1.forEach((sprite, index) => {
            let numeroDuSkin = index + 1;
            if (numeroDuSkin === this.skinJ1) {
                sprite.setTint(0xffff00); // Filtre Jaune
                sprite.setScale(2.5);     // Plus gros !
            } else {
                sprite.clearTint();       // On enlève le filtre
                sprite.setScale(2);       // Taille normale
            }
        });

        this.btnsJ2.forEach((sprite, index) => {
            let numeroDuSkin = index + 1;
            if (numeroDuSkin === this.skinJ2) {
                sprite.setTint(0xffff00);
                sprite.setScale(2.5);
            } else {
                sprite.clearTint();
                sprite.setScale(2);
            }
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
            .setInteractive({ cursor: 'pointer' })
            .on('pointerover', () => btnJouer.setColor('#ffffff'))
            .on('pointerout', () => btnJouer.setColor('#ff0000'))
            .on('pointerdown', () => {
                this.lancerJeu();
            });
        this.ecranControles.add(btnJouer);
    }

    private lancerJeu() {
        console.log(`Lancement ! J1: skin n°${this.skinJ1} | J2: skin n°${this.skinJ2}`);
        
        this.scene.start('game-scene', { 
            skinJoueur1: this.skinJ1, 
            skinJoueur2: this.skinJ2 
        });
    }
}