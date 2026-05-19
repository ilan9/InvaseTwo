import Phaser from 'phaser';
import Arme from './Arme'; 
import type Player from '../Joueur';

export default class Shotgun extends Arme {

    constructor(scene: Phaser.Scene, groupeBalles: Phaser.Physics.Arcade.Group,portee:number,level:number,cadence:number) {
        // On fixe les stats du Shotgun en dur ici
        super(scene, groupeBalles, "Shotgun", portee, level, cadence);
    }

    // L'ÉCRASEMENT (Override) du tir classique
    public tirer(joueur:Player, dep_x: number, dep_y: number, move_x: number, move_y: number): void {
        // 1. On calcule l'angle de base visé par le joueur (en radians)
        if(this.stoque > 0){
            this.stoque--
        const angleBase = Math.atan2(move_y, move_x);
        for (let i = -1; i <= 1; i++) {
            
            // Création de la balle
            const balle = this.scene.add.image(dep_x, dep_y, 'balle_pistol');
            balle.setScale(0.05);

            //  PI/8 (environ 22 degrés) 
            const angleTir = angleBase + ((Math.PI / 8) * i);
            
            // On tourne l'image
            balle.setRotation(angleTir + Math.PI / 2);
            
            this.scene.physics.add.existing(balle);
            const corpsBalle = balle.body as Phaser.Physics.Arcade.Body;
            balle.setData("degat", this.degat);
            balle.setData("joueur", joueur.name);
            this.groupe_balle.add(balle);

            // 4. LE SECRET PHYSIQUE : On calcule la NOUVELLE direction avec Cosinus et Sinus
            const nouveauMoveX = Math.cos(angleTir);
            const nouveauMoveY = Math.sin(angleTir);

            // Déplacer la balle dans sa nouvelle direction
            const vitesse_balle = 400;
            corpsBalle.setVelocity(nouveauMoveX * vitesse_balle, nouveauMoveY * vitesse_balle);
            
            // Portée de la balle
            const dure_vie = (this.portee / vitesse_balle) * 1000;
            this.scene.time.delayedCall(dure_vie, () => {
                if (balle.active) { balle.destroy(); }
            });
        }
        }else{
            joueur.console.ajouterMessage(`Plus de balle dans ${this.nom}`);
        }
        joueur.console.affiche_stoque(this.nom,this.stoque,this.stoquage[this.cpt_stoque-1])
    }
}