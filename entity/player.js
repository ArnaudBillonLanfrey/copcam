class Player extends BaseEntity {
    constructor(model) {
        super(model);
        this.canShoot = true;
        this.isRotating = false;
        this.model.isRotating = false;
        this.damage = 30;
        this.projectile = null;
    }

    setRotating(bool) {
        this.model.isRotating = bool;
    }

    getDamage() {
        return this.damage;
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

