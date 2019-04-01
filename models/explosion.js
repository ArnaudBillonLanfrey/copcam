class Explosion extends Splat {

    constructor(textures) {
        super(textures[0]);
        this.textures = textures;
        this.time = 0;
        this.currentIdx = 0;
        this.end = false;
    }
    setParameters(elapsedTime) {
        this.time += elapsedTime;
        if(this.currentIdx < this.textures.length -1) {
            if(this.time>=(this.currentIdx+1) * 50) {
                this.currentIdx++;
                this.splatTexture = this.textures[this.currentIdx];
               // console.log(this.time);
            }
        } else {
            this.end = true;
        }
    }

    isFinished() {
        return this.end;
    }
}