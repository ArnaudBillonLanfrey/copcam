class Machinegun extends baseProjectiles{

    constructor(texture) {
        super(texture);
        this.damage = 7;
    }
    

    initParameters() {
        super.initParameters();
        var randScale = getRandomFloat(0.8,1.2);
        this.width = 0.02 * randScale;
        this.height = 0.08 * randScale;
        this.speed = 0.05;
        this.delayShoot = 150;

    }
}