import Phaser from 'phaser';
import Player from './Joueur';

export default class Monstre extends Phaser.Physics.Arcade.Sprite {
    public point_degat:number;
    public vie_monstre:number;


    constructor(scene: Phaser.Scene,porte:number,skin:string,level:number) {
        if (porte == 1){
            var x = 978/2
            var y = 0
        }else if (porte == 3){
            var x = 978/2
            var y = 550
        }else if (porte == 2){
            var x = 978
            var y = 550/2
        }else{
            var x = 0
            var y = 550/2
        }
        let offset_x = Phaser.Math.Between(-30, 30);
        let offset_y = Phaser.Math.Between(-30, 30);
        super(scene, x+offset_x, y+offset_y, skin);
        scene.add.existing(this);         // Pour l'afficher à l'écran
        scene.physics.add.existing(this); 
        this.setScale(0.5)
        this.setBounce(1)
        this.setMass(10)
        

        this.point_degat = 10*level
        this.vie_monstre = 50*level
    }
    update(joueur1:Player, joueur2:Player):void {
        
        let distanceJ1 = Phaser.Math.Distance.Between(this.x, this.y, joueur1.x, joueur1.y);
        let distanceJ2 = Phaser.Math.Distance.Between(this.x, this.y, joueur2.x, joueur2.y)

        if (joueur1.vie >0 && (distanceJ1 <= distanceJ2 || joueur2.vie <= 0)){
            if (distanceJ1 > 16){
                this.scene.physics.moveToObject(this, joueur1, 80);
            }
        }else if(joueur2.vie >0){
            if (distanceJ2 > 16){
                this.scene.physics.moveToObject(this, joueur2, 80);
            }
        }else{
            this.scene.physics.moveTo(this,978/2,550/2,80)
        }
        
    }
    attaquer(joueur: Player):void{
        joueur.degat(-1 * this.point_degat);
    }
    degat(degat:number): void {
        this.vie_monstre -= degat
        console.log(`il a pris ${degat} degat, il lui reste ${this.vie_monstre}PV.`)
        this.setTint(0xff0000);
        this.scene.time.delayedCall(1000, () => {
            this.clearTint();
        });
        if (this.vie_monstre <= 0){
            this.destroy() // Pas utiliser destroy
        }
    }






}