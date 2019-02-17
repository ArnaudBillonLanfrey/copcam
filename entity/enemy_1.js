class Enemy_1 extends BaseEntity {
    constructor(model) {
        super(model);
        this.model.speedFactor = 0.02

        this.model.rotateY(Math.PI);
        this.model.position2D = [this.model.position2D[0] - 2, this.model.position2D[1]];
        this.model.currentTransform = mat4.translate(mat4.identity(), [this.model.position2D[0],0,this.model.position2D[1]]);
    }
}