class Model {

    constructor(config,objData,bufferOpts = null) {       
        this.bbmin = [0,0,0];
        this.bbmax = [0,0,0];
        
        this.bbminP = [-100,-100,-100,-100];
        this.bbmaxP = [-100,-100,-100,-100];
        this.loaded = false;
        this.config = config;
    
        if(!bufferOpts) {
            this.vertexBuffer = gl.createBuffer();
            this.vertexBuffer.itemSize = 0;
            this.vertexBuffer.numItems = 0;
            
            this.normalBuffer = gl.createBuffer();
            this.normalBuffer.itemSize = 0;
            this.normalBuffer.numItems = 0;
            this.handleLoadedObject(objData);

        } else {
            this.vertexBuffer = bufferOpts.vertexBuffer;
            this.normalBuffer = bufferOpts.normalBuffer;
            this.vao = bufferOpts.vao;
            this.computeBoundingBox(objData[0]);
            this.initParameters(this.config);
            this.loaded = true;
            
        }
        this.initShader();
        this.shader;

    }

    initShader() {
        this.shader = initShaders("model-vs","model-fs");
        
        // active ce shader
        gl.useProgram(this.shader);

        // adresse de la variable uniforme uOffset dans le shader
        this.shader.modelMatrixUniform = gl.getUniformLocation(this.shader, "uModelMatrix");
        this.shader.viewMatrixUniform = gl.getUniformLocation(this.shader, "uViewMatrix");
        this.shader.projMatrixUniform = gl.getUniformLocation(this.shader, "uProjMatrix");
        this.shader.lightUniform = gl.getUniformLocation(this.shader, "uLight");
        this.shader.colorUniform = gl.getUniformLocation(this.shader, "uColor");

        //console.log("model shader initialized");
    }

    computeBoundingBox(vertices) {
        var i,j;
        
        if(vertices.length>=3) {
        this.bbmin = [vertices[0],vertices[1],vertices[2]];
        this.bbmax = [vertices[0],vertices[1],vertices[2]];
        }
    
        for(i=3;i<vertices.length;i+=3) {
        for(j=0;j<3;j++) {
            if(vertices[i+j]>this.bbmax[j]) {
            this.bbmax[j] = vertices[i+j];
            }
    
            if(vertices[i+j]<this.bbmin[j]) {
            this.bbmin[j] = vertices[i+j];
            }
        }
        }
    }

    isCollidingWith2D(pos2D,width,height) {
        // [1] ==  1 > bot
        //     == -1 > top
        // [0] == -1 > left
        //     ==  1 > right
        const { minX, maxX, minY, maxY } = this.getBBox();
        if((pos2D.x >= maxX)      // trop à droite

        || (pos2D.x + width <= minX) // trop à gauche

        || (pos2D.y <= maxY  ) // trop en bas

        || (pos2D.y + height >= minY))  
        {
            /*
            console.log("-------------------");
            console.log(pos2D.x + ">=" + maxX);
            console.log(pos2D.x + width + "<=" + minX);
            console.log(pos2D.y + "<="+ minY );
            console.log(pos2D.y + height +">="+ maxY);
            console.log("-------------------");*/
            return false; 
        }
            
        else {
            /*
            console.log("POS2D",pos2D);
            console.log("WIDTH/HEIGHT", [width, height]);
            console.log("BBOX",bbox);*/
            return true; 
        }

    }

    isCollidingWithBB(obj_bbox) {
        const { minX, maxX, minY, maxY } = this.getBBox();
        if((obj_bbox.minX >= maxX)      // trop à droite

        || (obj_bbox.maxX <= minX) // trop à gauche

        || (obj_bbox.minY <= maxY  ) // trop en bas

        || (obj_bbox.maxY >= minY))  
        {

            return false; 

        }else {
            return true; 
        }


    }

    handleLoadedObject(objData) {
        var vertices = objData[0];
        var normals = objData[1];
    
        /*console.log("Nb vertices: " + vertices.length/3);*/
        
        this.computeBoundingBox(vertices);
        /*console.log("BBox min: "+this.bbmin[0]+","+this.bbmin[1]+","+this.bbmin[2]);
        console.log("BBox max: "+this.bbmax[0]+","+this.bbmax[1]+","+this.bbmax[2]);*/
    
        this.initParameters(this.config);
    
        this.vao = gl.createVertexArray(); // id qui stock les buffers créé pour les manipuler facilement
        gl.bindVertexArray(this.vao); // attache les futurs modifs au vertex array
        
        // cree un nouveau buffer sur le GPU et l'active
        this.vertexBuffer = gl.createBuffer();
        this.vertexBuffer.itemSize = 3;
        this.vertexBuffer.numItems = vertices.length/3;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer); // active le buffer
        gl.enableVertexAttribArray(0); // met le tableau de sommet dans la location n°0
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW); // upload dans le buffer
        gl.vertexAttribPointer(0, this.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0); // décrit ce qu'il y'a dans le tableau (de sommet)
    
    
        this.normalBuffer = gl.createBuffer();
        this.normalBuffer.itemSize = 3;
        this.normalBuffer.numItems = normals.length/3;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer); // active le buffer
        gl.enableVertexAttribArray(1);
        gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW); // upload dans le buffer
        gl.vertexAttribPointer(1, this.normalBuffer.itemSize, gl.FLOAT, false, 0, 0);
        
        
        gl.bindVertexArray(null); // stop le binding
    
        //console.log("model initialized");
        this.loaded = true;
    }

    initParameters(config) {
        this.currentTransform = mat4.identity();
        this.modelMatrix = mat4.identity(); //positionne l'obj
        this.viewMatrix = mat4.identity(); //positionne la vue
        this.projMatrix = mat4.identity(); // projete le tout dans une dimension {perspective}
    
        this.modelMatrix = mat4.scale(this.modelMatrix, [0.1,0.1,0.1]);
        this.viewMatrix = mat4.lookAt( [0,5,0],[0,0,0],[-1,0,0]);
    
        this.projMatrix = mat4.perspective(45, 1, 0.1,30);
        this.position2D = {x:0,y:0};

        this.lightValue = 0;
        this.color = [217,122,80];
        if(config) {
            Object.assign(this,config);
        }
    }
    modifyScale(scale) {
        this.modelMatrix = mat4.scale(this.modelMatrix, scale);
    }

    modifyView(newView) {
        this.viewMatrix = newView;
    }

    setParameters(elapsed) {
    }

    move(x,y) {
        const { minX, maxX, minY, maxY } = this.getBBox();
        if ((x === 1 && maxX < 1)
        || (x === -1 && minX > -1)
        || (y === 1 && minY < 1)
        || (y === -1 && maxY > -1)) {
            this.position2D.x = this.position2D.x + x * this.speedFactor,
            this.position2D.y = this.position2D.y + y * this.speedFactor
            this.currentTransform = mat4.translate(mat4.identity(), [-this.position2D.y, 0, -this.position2D.x]);
       }
    }
    // move without checking border (screen) collision 
    moveNoBC(x,y) {
        this.position2D.x = this.position2D.x + x * this.speedFactor,
        this.position2D.y = this.position2D.y + y * this.speedFactor
        this.currentTransform = mat4.translate(mat4.identity(), [-this.position2D.y, 0, -this.position2D.x]);
    }

    getBBox() {
        // happen when we rotate the model
        if(this.bbmaxP[0] < this.bbminP[0]) {
            //invvert
            return {
                minX: this.bbmaxP[0],
                minY: this.bbminP[1],
                maxX: this.bbminP[0],
                maxY: this.bbmaxP[1]
            }
        } else {
            return {
                minX: this.bbminP[0],
                minY: this.bbmaxP[1],
                maxX: this.bbmaxP[0],
                maxY: this.bbminP[1]
            }
        }

    }

    sendUniformVariables() {
        if(this.loaded) {
        var m = mat4.create();
        var v = this.viewMatrix;
        var p = this.projMatrix;
        mat4.multiply(this.currentTransform,this.modelMatrix,m);
    
        // envoie des matrices aux GPU
        gl.uniformMatrix4fv(this.shader.modelMatrixUniform,false,m);
        gl.uniformMatrix4fv(this.shader.viewMatrixUniform,false,this.viewMatrix);
        gl.uniformMatrix4fv(this.shader.projMatrixUniform,false,this.projMatrix);
        gl.uniform3f(this.shader.lightUniform, Math.sin(this.lightValue), 0., 1.);
        gl.uniform3f(this.shader.colorUniform, ...this.color);

        // calcul de la boite englobante (projetée)
        mat4.multiplyVec4(m,[this.bbmin[0],this.bbmin[1],this.bbmin[2],1],this.bbminP);
        mat4.multiplyVec4(m,[this.bbmax[0],this.bbmax[1],this.bbmax[2],1],this.bbmaxP);
        mat4.multiplyVec4(v,this.bbminP);
        mat4.multiplyVec4(v,this.bbmaxP);
        mat4.multiplyVec4(p,this.bbminP);
        mat4.multiplyVec4(p,this.bbmaxP);
    
        this.bbminP[0] /= this.bbminP[3];
        this.bbminP[1] /= this.bbminP[3];
        this.bbminP[2] /= this.bbminP[3];
        this.bbminP[3] /= this.bbminP[3];
    
        this.bbmaxP[0] /= this.bbmaxP[3];
        this.bbmaxP[1] /= this.bbmaxP[3];
        this.bbmaxP[2] /= this.bbmaxP[3];
        this.bbmaxP[3] /= this.bbmaxP[3];
        
        
        }
    }

    draw() {
        if(this.loaded) {
            gl.bindVertexArray(this.vao); //active le vertex array
            gl.drawArrays(gl.TRIANGLES,0,this.vertexBuffer.numItems) // dessine le tableau
            gl.bindVertexArray(null); //désactive
        }
    }

    rotateY(angle) {
        this.currentTransform = mat4.rotateY(this.modelMatrix,angle);
    }

    clear() {
        // clear all GPU memory
        gl.deleteBuffer(this.vertexBuffer);
        gl.deleteBuffer(this.normalBuffer);
        gl.deleteVertexArray(this.vao);
        this.loaded = false;
    }

    setLightValue(light) {
        this.lightValue = light;
    }
}


