import Phaser from 'phaser';
import Arme from './Arme'; 
import type Player from '../Joueur';

export default class Barrel extends Arme {

    constructor(scene: Phaser.Scene, groupeBalles: Phaser.Physics.Arcade.Group,portee:number,level:number,cadence:number) {
        super(scene, groupeBalles, "Barrel", portee, level, cadence);

    }

    // L'ÉCRASEMENT (Override) du tir classique
    public tirer(joueur:Player, dep_x: number, dep_y: number, move_x: number, move_y: number): void {
        if (this.stoque > 0){
                this.stoque--
            let x = dep_x + 30*move_x
            let y = dep_y + 30*move_y

            const barrel = this.scene.physics.add.image(x,y, 'barrel');
            barrel.setScale(0.8)
            this.scene.events.emit("create_barrel", barrel);
    }else{
            joueur.console.ajouterMessage(`Plus de balle dans ${this.nom}`);
        }
        joueur.console.affiche_stoque(this.nom,this.stoque,this.stoquage[this.cpt_stoque-1])
    }
}