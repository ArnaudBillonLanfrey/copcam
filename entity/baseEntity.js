class BaseEntity {
    constructor(model) {
        this.model = model;
        this.model.speedFactor = 0.1;  
        this.hp = 100;
    }

    move(x,y) {
        this.model.move(x,y);
    }

    setPosition(x,y) {
        this.model.setPosition(x,y);
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
    getHP() {
        return this.hp;
    }
}