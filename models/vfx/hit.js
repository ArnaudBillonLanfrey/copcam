class Hit extends baseVfx {

    constructor(textures) {
        super(textures,50);
    }
    initParameters() {
        super.initParameters();
        this.width = 0.1;
        this.height = 0.1;
    }

}