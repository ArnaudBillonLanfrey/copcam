class Player extends BaseEntity {
    constructor(model) {
        super(model);
        this.delayShoot = 500;
        this.canShoot = true;
    }
}

