import Phaser from 'phaser';
import Arme from './Arme'; 
import type Player from '../Joueur';

export default class Lance_roquette extends Arme {

    constructor(scene: Phaser.Scene, groupeBalles: Phaser.Physics.Arcade.Group,portee:number,level:number,cadence:number) {
        // On fixe les stats du Lance_roquette en dur ici
        super(scene, groupeBalles, "Lance_roquette", portee, level, cadence);
    }

    // L'ÉCRASEMENT (Override) du tir classique
    public tirer(joueur:Player, dep_x:number,dep_y:number,move_x:number,move_y:number) {
            //console.log(`Tire avec ${this.nom} depuis ${dep_x}${dep_y} en direction: ${move_x},${move_y}.`);
            if(this.stoque > 0 ){
            // Création de la balle
            this.stoque--
            const balle = this.scene.add.sprite(dep_x,dep_y,'roquette');
            balle.setScale(0.05)
            balle.setRotation(Math.atan2(move_y, move_x) + Math.PI/2);//pour la rotation et on ajoute 1/4
            const corpsBalle = balle.body as Phaser.Physics.Arcade.Body;
            balle.setData("degat",this.degat)
            balle.setData("joueur",joueur.name)
            this.scene.events.emit("create_roquette", balle);
    
            // Déplacer la balle
            const vitesse_balle = 400
            corpsBalle.setVelocity(move_x * vitesse_balle, move_y * vitesse_balle);
            
            // Porté de la balle
            const dure_vie = (this.portee / vitesse_balle) * 1000;
            console.log(dure_vie)
            this.scene.time.delayedCall(dure_vie,()=>{
                if (balle.active){balle.destroy()}
            })
        }else if (this.stoque<=0 && this.nom!="Pistolet"){
            joueur.console.ajouterMessage(`Plus de balle dans ${this.nom}`);
        
        }
        joueur.console.affiche_stoque(this.nom,this.stoque,this.stoquage[this.cpt_stoque-1])
        }
}