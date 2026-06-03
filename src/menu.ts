import Phaser from 'phaser';

export default class MenuScene extends Phaser.Scene {
    

    constructor() {
        // C'est l'identifiant secret de cette scène
        super('menu-scene'); 
    }

    create() {
        // Le Titre du jeu
        this.add.text(978/2, 100, 'InvaseTwo', { 
            fontSize: '50px', 
            fontFamily: 'Arial', 
            color: '#ff0000' 
        }).setOrigin(0.5); // Le setOrigin(0.5) permet de centrer le texte pile au milieu

        // Selection J1
        const btnJ1 = this.add.text(300, 300, '> Choisir J1 <', { fontSize: '30px', color: '#ffffff' })
            .setOrigin(0.5)
            .setInteractive() 
            .on('pointerdown', () => {
                // Quand on clique, on lance la fonction avec le mot 'J1'
                this.lancerJeu('J1');
            });

        // 3. Le Bouton "Jouer avec J2"
        const btnJ2 = this.add.text(700, 300, '> Choisir J2 <', { fontSize: '30px', color: '#ffffff' })
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', () => {
                this.lancerJeu('J2'); 
            });

        // Petit bonus pour faire joli : quand la souris passe dessus, le texte devient vert !
        btnJ1.on('pointerover', () => btnJ1.setColor('#00ff00'));
        btnJ1.on('pointerout', () => btnJ1.setColor('#ffffff'));
        
        btnJ2.on('pointerover', () => btnJ2.setColor('#00ff00'));
        btnJ2.on('pointerout', () => btnJ2.setColor('#ffffff'));
    }

    // La fonction qui ferme le menu et lance le jeu
    private lancerJeu(skinChoisi: string) {
        console.log("Lancement du jeu avec le skin :", skinChoisi);
        
        // C'EST ICI QUE TOUT SE JOUE : 
        // On lance 'game-scene' (MyGame) et on lui envoie un "colis" avec les données !
        this.scene.start('game-scene', { 
            skinJoueur1: skinChoisi, 
            skinJoueur2: 'J1' // Tu peux forcer le joueur 2 à être un J1, ou faire un autre bouton pour lui !
        });
    }
}