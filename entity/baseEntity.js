class BaseEntity {
    constructor(model) {
        this.model = model;
        this.model.speedFactor = 0.1;  
    }

    move(x,y) {
        this.model.move(x,y);
    }

    setPosition(x,y) {
        this.model.setPosition(x,y);
    }

    destroy() {
        this.model.clear();
    }

    isLoaded() {
        return this.model.loaded;
    }
    setParameters(elapsed) {
        this.model.setParameters(elapsed);
    }
}