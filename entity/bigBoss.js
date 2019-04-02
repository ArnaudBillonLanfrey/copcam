class BigBoss extends BaseEntity {
    constructor(model) {
        super(model);
        this.model.color = [255,255,255];
        this.model.speedFactor = 0.0005;
        this.model.modifyScale([7,7,7]);
        this.model.rotateY(Math.PI);
        this.model.position2D.y = 2.5;
        this.hp = 500;
    }

    setParameters(elapsed) {
        super.setParameters(elapsed);
        const { minX, maxX, minY, maxY } = this.model.getBBox();
        if (
            minY < -1
        ) {
            console.log("DISAPEAAAAAAAR");
            this.model.loaded = false;
        }
    }

}