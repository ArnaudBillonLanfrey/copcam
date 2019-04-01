class baseProjectiles extends Splat{

    constructor(texture) {
        super(texture);
        this.damage = 10;
    }

    initParameters() {
        this.width = 0.04;
        this.height = 0.1;
        this.position = {x:0,y:0};
        this.speed = 0.05;
        this.delayShoot = 150;
    }
    getDamage() {
        return this.damage;
    }
}