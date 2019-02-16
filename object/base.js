class BaseObject {
    constructor(model) {
        this.model = model;
        this.speedFactor = 0.1;  
    }

    move(x,y) {
        let m = this.model;
        if( (y===1&& m.getBBox()[0][0]<1)
        || (y===-1 && m.getBBox()[1][0]>-1) 
        || (x === 1 && m.getBBox()[0][1]<1) 
        || (x === -1 && m.getBBox()[1][1]>-1))
       {
               m.position2D = [m.position2D[0] - x * m.speedFactor, m.position2D[1] - y * m.speedFactor];
               m.currentTransform = mat4.translate(mat4.identity(), [m.position2D[0],0,m.position2D[1]]);
       }
    }

    setPosition(x,y) {
        this.model.setPosition(x,y);
    }

    destroy() {
        this.model.clear();
    }
}