var splatShader;

function initSplatShader() {
    splatShader = initShaders("splat-vs","splat-fs");
    
    // active ce shader
    gl.useProgram(splatShader);
    
    // adresse de la texture uHeightfield dans le shader
    splatShader.positionUniform = gl.getUniformLocation(splatShader, "uPosition");
    splatShader.texUniform = gl.getUniformLocation(splatShader, "uTex");

    //console.log("splat shader initialized");
}

function Splat(splatTexture) {
    this.splatTexture = splatTexture;
    this.initParameters();
    //0.966 -> over plane
    // 0.990 -> under  heightfield
    var z_axis = 0.967 /*+ Math.random()*0.020*/;
    // un tableau contenant les positions des sommets (sur CPU donc)
    var vertices = [
	-this.width,-this.height, z_axis,
	this.width,-this.height, z_axis,
	this.width, this.height, z_axis,
	-this.width, this.height, z_axis
    ];
    
    var coords = [
	0.0, 0.0, 
	1.0, 0.0, 
	1.0, 1.0, 
	0.0, 1.0
    ];
    
    var tri = [0,1,2,0,2,3];
    
    this.vao = gl.createVertexArray();
    gl.bindVertexArray(this.vao);
    
    // cree un nouveau buffer sur le GPU et l'active
    this.vertexBuffer = gl.createBuffer();
    this.vertexBuffer.itemSize = 3;
    this.vertexBuffer.numItems = 4;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.enableVertexAttribArray(0);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.vertexAttribPointer(0, this.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
    
    // meme principe pour les coords
    this.coordBuffer = gl.createBuffer();
    this.coordBuffer.itemSize = 2;
    this.coordBuffer.numItems = 4;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.coordBuffer);
    gl.enableVertexAttribArray(1);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(coords), gl.STATIC_DRAW);
    gl.vertexAttribPointer(1, this.coordBuffer.itemSize, gl.FLOAT, false, 0, 0);

    // creation des faces du cube (les triangles) avec les indices vers les sommets
    this.triangles = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.triangles);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(tri), gl.STATIC_DRAW);
    this.triangles.numItems = 6;

    gl.bindVertexArray(null);
    this.loaded = true;
    
    //console.log("splat initialized");
}


Splat.prototype.shader = function() {
    return splatShader;
}

Splat.prototype.initParameters = function() {
    this.width = 0.25;
    this.height = 0.25;
    this.position = {x:0,y:0};
    this.speed = 0.05;
    this.direction = {x:0,y:1};

    //this.tex = initTexture("spaceship.png");
    // we could init some params here 
}

Splat.prototype.setPosition = function(x,y) {
    this.position.x = x;
    this.position.y = y;
}

Splat.prototype.setParameters = function(elapsed) {
    // we could animate something here
    this.position.x += this.direction.x * this.speed;
    this.position.y += this.direction.y * this.speed;

    if(this.position.y > 1) {
        this.clear();
    }
}

Splat.prototype.sendUniformVariables = function() {
    if(this.loaded) {
	gl.uniform2fv(splatShader.positionUniform,Object.values(this.position));

	// // how to send a texture: 
	 gl.activeTexture(gl.TEXTURE0);
	 gl.bindTexture(gl.TEXTURE_2D,this.splatTexture);
     gl.uniform1i(splatShader.texUniform, 0);
    }
}


Splat.prototype.rotate = function() {
    
}
Splat.prototype.draw = function() {
    if(this.loaded) {
	gl.bindVertexArray(this.vao);
	gl.drawElements(gl.TRIANGLES, this.triangles.numItems, gl.UNSIGNED_SHORT, 0);
	gl.bindVertexArray(null);
    }
}


Splat.prototype.clear = function() {
    // clear all GPU memory
    gl.deleteBuffer(this.vertexBuffer);
    gl.deleteBuffer(this.coordBuffer);
    gl.deleteVertexArray(this.vao);
    this.loaded = false;
}
