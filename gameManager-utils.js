/**
 * return the data object of the .obj passed in parameter
 * @param {string} filename 
 */
function loadModel(filename) {

    return new Promise( (resolve,reject) => {
        let xmlhttp = new XMLHttpRequest();

        xmlhttp.onreadystatechange = function () {
    
            if (xmlhttp.readyState == XMLHttpRequest.DONE) {
    
                if (xmlhttp.status == 200) {
    
                    let data = xmlhttp.responseText;
    
                    let lines = data.split("\n");
    
                    let positions = [];
                    let normals = [];
                    let arrayVertex = []
                    let arrayNormal = [];
    
                    for (let i = 0; i < lines.length; i++) {
                        let parts = lines[i].trimRight().split(' ').filter((p) => p !== "");
                        if (parts.length > 0) {
                            switch (parts[0]) {
                                case 'v': positions.push(
                                    vec3.create([
                                        parseFloat(parts[1]),
                                        parseFloat(parts[2]),
                                        parseFloat(parts[3])]
                                    ));
                                    break;
                                case 'vn':
                                    normals.push(
                                        vec3.create([
                                            parseFloat(parts[1]),
                                            parseFloat(parts[2]),
                                            parseFloat(parts[3])]
                                        ));
                                    break;
                                case 'f': {
                                    let f1 = parts[1].split('/');
                                    let f2 = parts[2].split('/');
                                    let f3 = parts[3].split('/');
                                    Array.prototype.push.apply(arrayVertex, positions[parseInt(f1[0]) - 1]);
                                    Array.prototype.push.apply(arrayVertex, positions[parseInt(f2[0]) - 1]);
                                    Array.prototype.push.apply(arrayVertex, positions[parseInt(f3[0]) - 1]);
    
                                    Array.prototype.push.apply(arrayNormal, normals[parseInt(f1[2]) - 1]);
                                    Array.prototype.push.apply(arrayNormal, normals[parseInt(f2[2]) - 1]);
                                    Array.prototype.push.apply(arrayNormal, normals[parseInt(f3[2]) - 1]);
                                    break;
                                }
                                default: break;
                            }
                        }
                    }
    
                    let objData = [
                        new Float32Array(arrayVertex),
                        new Float32Array(arrayNormal)
                    ]
                    resolve(objData);
    
                } else {
                    reject('failed to load the model');
                }
            }
        };
    
        console.log("Loading Model <" + filename + ">...");
    
        xmlhttp.open("GET", filename, true);
        xmlhttp.send();
    });
    
}