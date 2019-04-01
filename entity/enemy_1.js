class Enemy_1 extends BaseEntity {
    constructor(model) {
        super(model);
        this.model.color = [255,0,0];
        this.model.speedFactor = 0.05;
        this.model.modifyScale([0.5,0.5,0.5]);
        this.model.rotateY(Math.PI);
        this.model.position2D.y = 2.5;
        this.model.position2D.x = Math.random() * 2 - Math.random() * 2;
    }

    setParameters(elapsed) {
        super.setParameters(elapsed);
        const { minX, maxX, minY, maxY } = this.model.getBBox();
        if (
            minX < -1 ||
            maxX > 1 ||
            minY < -1
        ) {
            this.model.loaded = false;
        }
    }


}
