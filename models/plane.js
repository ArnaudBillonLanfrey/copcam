class Plane extends Model {
    constructor(objData) {
        super(objData);
        this.speedFactor = 0.1;
        this.rotation = 0;
        this.rotationFactor = Math.PI / 40;
        this.isRotating = false;
    }

    move(x, y) {
        if ((y === 1 && this.getBBox()[0][0] < 1)
            || (y === -1 && this.getBBox()[1][0] > -1)
            || (x === 1 && this.getBBox()[0][1] < 1)
            || (x === -1 && this.getBBox()[1][1] > -1)) {
            if ((this.rotation < Math.PI / 6 && y < 0) || this.rotation > -Math.PI / 6 && y > 0) {
                this.rotation -= y * this.rotationFactor;
            }
            this.position2D = [this.position2D[0] - x * this.speedFactor, this.position2D[1] - y * this.speedFactor];
        }
    }

    setParameters(elapsed) {
        var rMat = mat4.rotate(mat4.identity(), this.rotation, [1, 0, 0]);
        var tMat = mat4.translate(mat4.identity(), [this.position2D[0], 0, this.position2D[1]]);
        this.currentTransform = mat4.multiply(tMat,rMat);
        if(!this.isRotating) {
            // if the rotation is around 0
            if(this.rotation > 0 && this.rotation < Math.PI/20 || this.rotation < 0 && this.rotation > Math.PI/20) {
                this.rotation = 0;
            } else {
                if(this.rotation > 0) {
                    this.rotation -= this.rotationFactor/2;
                } else if(this.rotation!=0) {
                    this.rotation += this.rotationFactor/2;
                    //console.log(this.rotation);
                }
            }
        }
    }
}