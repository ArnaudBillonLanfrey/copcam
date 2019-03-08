class Player extends BaseEntity {
    constructor(model) {
        super(model);
        this.delayShoot = 500;
        this.canShoot = true;
        this.isRotating = false;
        this.model.isRotating = false;
    }

    setRotating(bool) {
        this.model.isRotating = bool;
    }
}

