class Player extends BaseEntity {
    constructor(model) {
        super(model);
        this.delayShoot = 500;
        this.canShoot = true;
        this.isRotating = false;
        this.model.isRotating = false;
        this.damage = 30;
    }

    setRotating(bool) {
        this.model.isRotating = bool;
    }

    getDamage() {
        return this.damage;
    }
}

