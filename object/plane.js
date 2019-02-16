class Plane extends BaseObject {
    constructor(model) {
        super(model);
        this.speedFactor = 0.1;
        this.rotation = 0;
        this.rotationFactor = Math.PI / 40;
        this.delayShoot = 500;
        this.canShoot = true;
    }

    move(x, y) {
        let m = this.model;
        if ((y === 1 && m.getBBox()[0][0] < 1)
            || (y === -1 && m.getBBox()[1][0] > -1)
            || (x === 1 && m.getBBox()[0][1] < 1)
            || (x === -1 && m.getBBox()[1][1] > -1)) {
            if ((this.rotation < Math.PI / 6 && y > 0) || this.rotation > -Math.PI / 6 && y < 0) {
                this.rotation += y * this.rotationFactor;
                m.currentTransform = mat4.rotate(m.modelMatrix, (this.rotationFactor), [y * -1, 0, 0]);
            }
            m.position2D = [m.position2D[0] - x * this.speedFactor, m.position2D[1] - y * this.speedFactor];
            m.currentTransform = mat4.translate(mat4.identity(), [m.position2D[0], 0, m.position2D[1]]);
        }
    }
}