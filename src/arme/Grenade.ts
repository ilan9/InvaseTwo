import Phaser from 'phaser';
import Arme from './Arme'; 
import type Player from '../Joueur';

export default class Grenade extends Arme {

    constructor(scene: Phaser.Scene, groupeBalles: Phaser.Physics.Arcade.Group,portee:number,level:number,cadence:number) {
        super(scene, groupeBalles, "Grenade", portee, level, cadence);

    }

    // L'ÉCRASEMENT (Override) du tir classique
    public tirer(joueur:Player, dep_x: number, dep_y: number, move_x: number, move_y: number): void {
        if (this.stoque > 0){
                this.stoque--
            let x = dep_x + 30*move_x
            let y = dep_y + 30*move_y

            const Grenade = this.scene.physics.add.image(x,y, 'grenade');
            Grenade.setScale(1)
            const corpsGrenade = Grenade.body as Phaser.Physics.Arcade.Body;
            this.scene.events.emit("create_grenade", Grenade);
            corpsGrenade.setVelocity(move_x * 400, move_y * 400); 
            corpsGrenade.setDrag(350);
            
            // Rebond
            corpsGrenade.setBounce(0.5); 
            corpsGrenade.setAngularVelocity(150);

            

            this.scene.time.delayedCall(2500, () => {
                if (Grenade.active) {
                    corpsGrenade.setAngularVelocity(0); 
                    this.scene.events.emit("boum_grenade", Grenade);
                }
            });

        } else {
            joueur.console.ajouterMessage(`Plus de grenades !`);
        }
        joueur.console.affiche_stoque(this.nom, this.stoque, this.stoquage[this.cpt_stoque-1]);
    }
}