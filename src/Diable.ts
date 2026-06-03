import Phaser from 'phaser';
import Player from './Joueur';
import Monstre from './Monstre';

export default class Diable extends Monstre {



    constructor(scene: Phaser.Scene,porte:number,skin:string,level:number) {
        super(scene, porte, skin, level);
    }
    
    attaquer(joueur: Player):void{
        joueur.degat(-1 * this.point_degat);
    }
   
}