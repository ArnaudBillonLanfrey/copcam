class Machinegun extends baseProjectiles{

    constructor(texture) {
        super(texture);
        this.damage = 7;
    }
    

    initParameters() {
        var randScale = getRandomFloat(0.8,1.2);
        this.width = 0.02 * randScale;
        this.height = 0.08 * randScale;
        this.position = {x:0,y:0};
        this.speed = 0.05;
        this.delayShoot = 1;
    }
}