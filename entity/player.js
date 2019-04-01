class Player extends BaseEntity {
    constructor(model) {
        super(model);
        this.canShoot = true;
        this.isRotating = false;
        this.model.isRotating = false;
        this.damageMultiplier = 1;
        this.projectile = null;
        this.model.modifyScale([.7,.7,.7]);
    }

    setRotating(bool) {
        this.model.isRotating = bool;
    }
    getDamageMultiplier() {
        return this.damageMultiplier;
    }
    setProjectile(projectile) {
        this.projectile = projectile;
    }
    getProjectile() {
        return this.projectile;
    }
    setSpeedFactor(speedFactor) {
        this.model.speedFactor = speedFactor;
    }
    getSpeedFacotr() {
        return this.mode.speedFactor;k
    }


    
}

