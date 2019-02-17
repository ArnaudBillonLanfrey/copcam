class Plane extends Model {
    constructor(objData) {
        super(objData);
        this.speedFactor = 0.1;
        this.rotation = 0;
        this.rotationFactor = Math.PI / 40;
    }

    move(x, y) {
        if ((y === 1 && this.getBBox()[0][0] < 1)
            || (y === -1 && this.getBBox()[1][0] > -1)
            || (x === 1 && this.getBBox()[0][1] < 1)
            || (x === -1 && this.getBBox()[1][1] > -1)) {
            if ((this.rotation < Math.PI / 6 && y > 0) || this.rotation > -Math.PI / 6 && y < 0) {
                this.rotation += y * this.rotationFactor;
                this.currentTransform = mat4.rotate(this.modelMatrix, (this.rotationFactor), [y * -1, 0, 0]);
            }
            this.position2D = [this.position2D[0] - x * this.speedFactor, this.position2D[1] - y * this.speedFactor];
            this.currentTransform = mat4.translate(mat4.identity(), [this.position2D[0], 0, this.position2D[1]]);
        }
    }
}