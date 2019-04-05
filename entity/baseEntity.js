class BaseEntity {
    constructor(model) {
        this.model = model;
        this.model.speedFactor = 0.1;  
        this.hp = 100;
        this.maxSpeedFactor = 0.45;
    }

    move(x,y) {
        this.model.move(x,y);
    }
    moveNoBC(x,y) {
        this.model.moveNoBC(x,y);
    }

    setPosition(x,y) {
        this.model.setPosition(x,y);
    }
    setSpeedFactor(newSF) {
        if(newSF < this.maxSpeedFactor) {
            this.model.speedFactor = newSF;
        }
    }

    getSpeedFactor() {
        return this.model.speedFactor;
    }

    setHP(newHP) {
        this.hp = newHP;
    }

    heal(amount) {
        this.hp += this.hp + amount > 100 ? 0 : amount;
    }

    getHP() {
        return this.hp;
    }


    destroy() {
        this.model.clear();
        this.hp = 0;
    }

    isLoaded() {
        return this.model.loaded;
    }
    setParameters(elapsed) {
        this.model.setParameters(elapsed);
    }

    takeDamage(amount) {
        this.hp -= amount;
    }

    isDead() {
        return this.hp<=0
    }

    isAlive() {
        return !this.isDead();
    }

    isLoaded() {
        return this.model.loaded;
    }
    setParameters(elapsed) {
        this.model.setParameters(elapsed);
    }
}