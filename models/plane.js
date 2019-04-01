class Plane extends Model {
    constructor(objData, bufferOpts) {
        super(objData, bufferOpts);
        this.speedFactor = 0.1;
        this.rotation = 0;
        this.rotationFactor = Math.PI / 40;
        this.isRotating = false;
    }

    move(x, y) {
        const { minX, maxX, minY, maxY } = this.getBBox();
        if ((x === 1 && maxX < 1)
        || (x === -1 && minX > -1)
        || (y === 1 && minY < 1)
        || (y === -1 && maxY > -1)) {
            if ((this.rotation < Math.PI / 6 && x === -1) || (this.rotation > -Math.PI / 6 && x === 1)) {
                this.rotation -= x * this.rotationFactor;
            }
            this.position2D.x = this.position2D.x + x * this.speedFactor;
            this.position2D.y = this.position2D.y + y * this.speedFactor;

        }
    }

    setParameters(elapsed) {
        //console.log(this.getBBox());
        var rMat = mat4.rotate(mat4.identity(), this.rotation, [1, 0, 0]);
        var tMat = mat4.translate(mat4.identity(), [-this.position2D.y, 0, -this.position2D.x]);
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