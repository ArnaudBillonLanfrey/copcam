class Spike extends baseProjectiles{

    constructor(texture) {
        super(texture);
        this.damage =30;
    }
    

    initParameters() {
        super.initParameters();
        this.width = 0.07;
        this.height = 0.07;
        this.speed = 0.02;
        this.delayShoot = 150;

    }
}