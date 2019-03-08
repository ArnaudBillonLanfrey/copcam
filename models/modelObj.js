class Model {

    constructor(objData) {
        this.vertexBuffer = gl.createBuffer();
        this.vertexBuffer.itemSize = 0;
        this.vertexBuffer.numItems = 0;
        
        this.normalBuffer = gl.createBuffer();
        this.normalBuffer.itemSize = 0;
        this.normalBuffer.numItems = 0;
        
        this.bbmin = [0,0,0];
        this.bbmax = [0,0,0];
        
        this.bbminP = [0,0,0,0];
        this.bbmaxP = [0,0,0,0];
        this.loaded = false;
    
        this.handleLoadedObject(objData);
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

        console.log("model shader initialized");
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

    handleLoadedObject(objData) {
        var vertices = objData[0];
        var normals = objData[1];
    
        /*console.log("Nb vertices: " + vertices.length/3);*/
        
        this.computeBoundingBox(vertices);
        /*console.log("BBox min: "+this.bbmin[0]+","+this.bbmin[1]+","+this.bbmin[2]);
        console.log("BBox max: "+this.bbmax[0]+","+this.bbmax[1]+","+this.bbmax[2]);*/
    
        this.initParameters();
    
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
    
        console.log("model initialized");
        this.loaded = true;
    }

    initParameters() {
        this.currentTransform = mat4.identity();
        this.modelMatrix = mat4.identity(); //positionne l'obj
        this.viewMatrix = mat4.identity(); //positionne la vue
        this.projMatrix = mat4.identity(); // projete le tout dans une dimension {perspective}
    
        this.modelMatrix = mat4.scale(this.modelMatrix, [0.1,0.1,0.1]);
        this.viewMatrix = mat4.lookAt( [0,5,0],[0,0,0],[-1,0,0]);
    
        this.projMatrix = mat4.perspective(45, 1, 0.1,30);
        this.position2D = [0,0];

        this.lightValue = 0;
        // trouver les model/view/proj matrices pour voir l'objet comme vous le souhaitez
    }

    setParameters(elapsed) {
    }

    move(x,y) {
        if( (y===1&& this.getBBox()[0][0]<1)
        || (y===-1 && this.getBBox()[1][0]>-1) 
        || (x === 1 && this.getBBox()[0][1]<1) 
        || (x === -1 && this.getBBox()[1][1]>-1))
       {
               this.position2D = [this.position2D[0] - x * this.speedFactor, this.position2D[1] - y * this.speedFactor];
               this.currentTransform = mat4.translate(mat4.identity(), [this.position2D[0],0,this.position2D[1]]);
       }
    }

    getBBox() {
        return [this.bbminP,this.bbmaxP];
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


