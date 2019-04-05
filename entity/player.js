class Player extends BaseEntity {
    constructor(model) {
        super(model);
        this.canShoot = true;
        this.isRotating = false;
        this.model.isRotating = false;
        this.damageMultiplier = 1;
        this.attackSpeedMultiplier = 1;
        this.model.modifyScale([.7,.7,.7]);
        this.chanceToPopSpike = .05;
    }

    setRotating(bool) {
        this.model.isRotating = bool;
    }
    getDamageMultiplier() {
        return this.damageMultiplier;
    }
    getAttackSpeedMultiplier() {
        return this.attackSpeedMultiplier;
    }
    setDamageMultiplier(newDmg) {
        this.damageMultiplier=newDmg;
    }
    setAttackSpeedMultiplier(newAtkSpeed) {
        this.attackSpeedMultiplier = newAtkSpeed;
    }

    incrChanceToPopSpike(amount) {
        this.chanceToPopSpike+= this.chanceToPopSpike + amount > 1 ? 0 : amount;
    }

    getChanceToPopSpike() {
        return this.chanceToPopSpike;
    }

}

