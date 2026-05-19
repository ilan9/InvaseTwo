import Phaser from 'phaser';
import Arme from './Arme'; 
import type Player from '../Joueur';

export default class Barrel extends Arme {

    constructor(scene: Phaser.Scene, groupeBalles: Phaser.Physics.Arcade.Group,portee:number,level:number,cadence:number) {
        super(scene, groupeBalles, "Barrel", portee, level, cadence);
    }

    // L'ÉCRASEMENT (Override) du tir classique
    public tirer(joueur:Player, dep_x: number, dep_y: number, move_x: number, move_y: number): void {
        
    }
}