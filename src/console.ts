import Phaser from 'phaser';

export default class ConsoleJoueur {
    private scene: Phaser.Scene;
    private x: number;
    private y: number;
    private textes: Phaser.GameObjects.Text[] = [];

    constructor(scene: Phaser.Scene, x: number, y: number) {
        this.scene = scene;
        this.x = x;
        this.y = y;
    }

    public ajouterMessage(message: string, couleur: string = '#ffffff'): void {
        // 1. On monte tous les anciens messages d'un cran (20 pixels vers le haut)
        this.textes.forEach(texteObj => {
            texteObj.y -= 20;
        });

        // 2. On crée le nouveau texte tout en bas
        const nouveauTexte = this.scene.add.text(this.x, this.y, message, {
            fontSize: '14px',
            fontFamily: 'Arial',
            color: couleur,
            stroke: '#000000',   // Un petit contour noir
            strokeThickness: 3   // ...pour que ça soit lisible sur n'importe quel décor !
        });

        // 3. On l'ajoute à notre liste mémoire
        this.textes.push(nouveauTexte);

        // 4. NETTOYAGE : Si on a plus de 5 messages, on détruit le plus vieux (tout en haut)
        // if (this.textes.length > 5) {
        //     const vieuxTexte = this.textes.shift(); // Récupère et retire le 1er élément
        //     vieuxTexte?.destroy(); // L'efface de l'écran
        // }

        // 5. Le message disparaît tout seul après 4 secondes !
        this.scene.time.delayedCall(4000, () => {
            if (nouveauTexte.active) {
                // Un joli effet de fondu (fade out)
                this.scene.tweens.add({
                    targets: nouveauTexte,
                    alpha: 0, // Transparence à 0
                    duration: 1000, // En 1 seconde
                    onComplete: () => {
                        nouveauTexte.destroy();
                        this.textes = this.textes.filter(t => t !== nouveauTexte);
                    }
                });
            }
        });
    }
}