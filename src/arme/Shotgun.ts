import Phaser from 'phaser';
import Arme from './Arme'; 

export default class Shotgun extends Arme {

    constructor(scene: Phaser.Scene, groupeBalles: Phaser.Physics.Arcade.Group,portee:number,level:number,cadence:number) {
        // On fixe les stats du Shotgun en dur ici
        super(scene, groupeBalles, "Shotgun", portee, level, cadence);
    }

    // L'ÉCRASEMENT (Override) du tir classique
    public tirer(joueur_name: string, dep_x: number, dep_y: number, move_x: number, move_y: number): void {
        
        //console.log(`Tire avec ${this.nom} depuis ${dep_x}${dep_y} en direction: ${move_x},${move_y}.`);
        for (let i = -1; i==2; i++) {
            console.log(i);
            // Création de la balle
            const balle = this.scene.add.image(dep_x,dep_y,'balle_pistol');
            balle.setScale(0.05)
            balle.setRotation(Math.atan2(move_y, move_x) + Math.PI/2+ (Math.PI/4*i));//pour la rotation et on ajoute 1/4
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
}