import Phaser from 'phaser';
import Monstre from '../Monstre';

export default class GestionnaireVagues {
    private scene: Phaser.Scene;
    private groupeEnnemis: Phaser.Physics.Arcade.Group;
    
    private vagueActuelle: number = 0;
    private vagueEnCours: boolean = false;
    private aff_vague:Phaser.GameObjects.Text

    // Quand on fabrique le gestionnaire, on lui donne la scène et le groupe
    constructor(scene: Phaser.Scene, groupeEnnemis: Phaser.Physics.Arcade.Group) {
        this.scene = scene;
        this.groupeEnnemis = groupeEnnemis;
        this.aff_vague = this.scene.add.text(100,125,``,{fontSize: '170px',fontFamily:'"Nosifer", cursive',color: "#ff0000",}).setDepth(11)
    }

    public lancerNouvelleVague(): void {
        this.vagueActuelle++;
        
        console.log(`--- Début de la Vague ${this.vagueActuelle} ---`);
        this.aff_vague.x=100
        this.aff_vague.setText(`Vague`)
        this.scene.time.delayedCall(1000, () => {
                // Un joli effet de fondu (fade out)
                this.scene.tweens.add({
                    targets: this.aff_vague,
                    alpha: 0, // Transparence à 0
                    duration: 1000, // En 1 seconde
                    onComplete: () => {
                        this.aff_vague.setAlpha(1)
                        this.aff_vague.x = 450
                        this.aff_vague.setText(`${this.vagueActuelle}`,)
                        this.scene.time.delayedCall(1000, () => {
                // Un joli effet de fondu (fade out)
                this.scene.tweens.add({
                    targets: this.aff_vague,
                    alpha: 0, // Transparence à 0
                    duration: 1000, // En 1 seconde
                    onComplete: () => {
                        this.aff_vague.setAlpha(1)
                        this.aff_vague.x=100
                        this.aff_vague.setText("")
                    }
                });
            
        });;
                    }
                });
            
        });;

        // RADIO : On crie à tout le jeu qu'on change de vague, et on donne le numéro !
        this.scene.events.emit('changement-vague', this.vagueActuelle);

        // On utilise "this.scene.cache" car la fonction JSON appartient à la scène
        const data = this.scene.cache.json.get('donnees_vagues');
        const infosVague = data.vagues[this.vagueActuelle - 1];

        if (!infosVague) {
            console.log("Félicitations, vous avez fini le jeu !");
            return;
        }
        //Cree les monstres
        this.scene.time.delayedCall(7000,()=>{ // fait apparaitre les monstre 7 sec apres le debut de la vague
            infosVague.ennemis.forEach((configEnnemi: any) => {
                for (let i = 0; i < configEnnemi.nombre; i++) {
                    const nouveauMonstre = new Monstre(this.scene, configEnnemi.porte, configEnnemi.type, configEnnemi.level);
                    this.vagueEnCours = true;
                    this.groupeEnnemis.add(nouveauMonstre);
                }
            })
        })
    }
    public update(): void {
        if (this.vagueEnCours && this.groupeEnnemis.countActive() === 0) {
            this.vagueEnCours = false;
            console.log("Vague nettoyée ! Prochaine vague dans 3 secondes...");
            
            this.scene.time.delayedCall(3000, () => {
                this.lancerNouvelleVague();
            });
        }
    }

}