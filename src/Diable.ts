import Phaser from 'phaser';
import Player from './Joueur';
import Monstre from './Monstre';

export default class Diable extends Monstre {
    private time_tire: number = 0; 
    private level: number

    constructor(scene: Phaser.Scene, porte: number, skin: string, level: number) {
        super(scene, porte, skin, level);
        this.point_degat = 15 
        this.level = level
    }


    update(joueur1: Player, joueur2: Player): void {
        //  On appelle le update du Monstre parent pour qu'il continue à marcher et lancer ses animations
        super.update(joueur1, joueur2);

        // trouve qui est le joueur le plus proche
        let cible = joueur1;
        let distanceJ1 = Phaser.Math.Distance.Between(this.x, this.y, joueur1.x, joueur1.y);
        let distanceJ2 = Phaser.Math.Distance.Between(this.x, this.y, joueur2.x, joueur2.y);
        
        if (joueur2.vie > 0 && (distanceJ2 < distanceJ1 || joueur1.vie <= 0)) { 
            cible = joueur2; 
        }

        //  LA MÉCANIQUE DE TIR À DISTANCE
        // Si le joueur est à moins de 400 pixels, le diable lui tire dessus 
        if (cible.vie > 0 && Phaser.Math.Distance.Between(this.x, this.y, cible.x, cible.y) <= 300) {
            
            // Cadence de tir (ex: 1 tir toutes les 1.5 secondes / 1500ms)
            if (this.scene.time.now - this.time_tire >= 4000) {
                for (let i = 0; i < this.level;i++){
                this.scene.time.delayedCall(i * 500, () => {
                // On vérifie qu'il est toujours en vie avant de tirer !
                if (this.active) { 
                    this.tirer_boule_feu(cible);
                }})
                this.time_tire = this.scene.time.now; // On réinitialise le chrono
            }
        }
    }}

    private tirer_boule_feu(cible: Player): void {
        // 1. Création du projectile
        // (Assure-toi d'avoir chargé une image 'boule_feu' dans le preload de MyGame !)
        const boule = this.scene.physics.add.sprite(this.x, this.y, 'boule_feu'); 
        boule.setTint(0xffaa00); // On la colorie en orange feu
        
        // 2. LA MAGIE PHASER : Calcul de l'angle exact entre le Diable et le Joueur
        const angle = Phaser.Math.Angle.Between(this.x, this.y, cible.x, cible.y);


        // 4. On lui donne une vitesse constante en ligne droite
        const vitesse = 250;
        const corpsBoule = boule.body as Phaser.Physics.Arcade.Body;
        // 5. On envoie les infos à MyGame.ts pour gérer les dégâts

        this.scene.events.emit("create_boule_feu", boule);
        // Cette fonction transforme l'angle en une force X et Y définitive !
        this.scene.physics.velocityFromRotation(angle, vitesse, corpsBoule.velocity);
        corpsBoule.setAngularVelocity(100)

        // 6. On détruit la boule au bout de quelques secondes si elle ne touche rien
        this.scene.time.delayedCall(3000, () => {
            if (boule.active) boule.destroy();
        });
    }
    

}