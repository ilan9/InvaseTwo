import Phaser from 'phaser';
import Arme from './Arme'; 
import type Player from '../Joueur';

export default class Barrel extends Arme {

    public x :number
    public y :number

    constructor(scene: Phaser.Scene, groupeBalles: Phaser.Physics.Arcade.Group,portee:number,level:number,cadence:number) {
        super(scene, groupeBalles, "Barrel", portee, level, cadence);

        this.x=0
        this.y=0
    }

    // L'ÉCRASEMENT (Override) du tir classique
    public tirer(joueur:Player, dep_x: number, dep_y: number, move_x: number, move_y: number): void {
        if (this.stoque > 0){
                this.stoque--
            if (move_x == 1){
                var x = dep_x + 20
            }else{
                var x = dep_x
            }if (move_y == 1){
                var y = dep_y + 20
            }else{
                var y = dep_y
            }
            this.x=x
            this.y=y
            const barrel = this.scene.add.image(x,y, 'barrel');
            this.scene.events.emit("create_barrel", barrel);
    }else{
            joueur.console.ajouterMessage(`Plus de balle dans ${this.nom}`);
        }
        joueur.console.affiche_stoque(this.nom,this.stoque,this.stoquage[this.cpt_stoque-1])
    }
}