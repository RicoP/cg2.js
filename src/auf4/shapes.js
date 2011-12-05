/*
 * WebGL / Javascript tutorial.
 * Author: Hartmut Schirmacher, hschirmacher.beuth-hochschule.de
 * (C)opyright 2011 by Hartmut Schirmacher, all rights reserved. 
 *
 */


/* 

   Class: VertexBasedShape
   The shape holds an array of vertices, and knows how to 
   draw itself using WebGL.
    
    Parameters to the constructor:
    - program is the Program that these buffer objects shall be bound to  
    - primitiveType is the geometric primitive to be used for drawing,
      e.g. gl.TRIANGLES, gl.LINES, gl.POINTS, gl.TRIANGLE_STRIP, 
            gl.TRIANGLE_FAN
    - numVertices is the number of vertices this object consists of
*/ 


VertexBasedShape = function(gl, primitiveType, numVertices) {

    // arrays in which to store vertex buffers and the respective 
    this.vertexBuffers = new Array();
    
    // remember what goemtric primitive to use for drawing
    this.primitiveType = primitiveType;
    
    // remember how many vertices this shape has
    this.numVertices = numVertices;

    // check if numVertices is a integer 
    if(numVertices != (~~numVertices)) {
        console.log("numVertices is not a full number."); 
    }

    // add a vertex attribute to the shape
    this.addVertexAttribute = function(gl, attrType, dataType, 
                                        numElements,dataArray) {
        this.vertexBuffers[attrType] = new VertexAttributeBuffer(gl,
                                            attrType, dataType,
                                            numElements,dataArray);
        var n = this.vertexBuffers[attrType].numVertices;
        if(this.numVertices != n) {
            window.console.log("Warning: wrong number of vertices (" 
                                + n + " instead of " + this.numVertices 
                                + ") for attribute " + attrType);
        }
    }
    
    /* 
       Method: draw using a vertex buffer object
    */
    this.draw = function(program) {
    
        // go through all types of vertex attributes 
        // and enable them before drawing
        for(attribute in this.vertexBuffers) {
            //window.console.log("activating attribute: " + attribute);
            this.vertexBuffers[attribute].makeActive(program);
        }
        
        // perform the actual drawing of the primitive 
        // using the vertex buffer object
        //window.console.log("drawing shape with " + 
        //                    this.numVertices + " vertices.");
        program.gl.drawArrays(primitiveType, 0, this.numVertices);

    }
}
             
/* 

   Class:  Triangle
   The triangle consists of three vertices. 
    
   Parameters to the constructor:
   - program is a Program object that knows which vertex attributes 
     are expected by its shaders
   
*/ 

Triangle = function(gl) {
 
    // instantiate the shape as a member variable
    this.shape = new VertexBasedShape(gl, gl.TRIANGLES, 3);

    var vposition = new Float32Array( [ 0,1,0,  -1,-1,0, 1,-1,0 ]);
    var vcolor    = new Float32Array( [ 1,0,0,  0,1,0,   0,0,1 ]);
    this.shape.addVertexAttribute(gl, "vertexPosition", gl.FLOAT, 3,
                                  vposition);
    this.shape.addVertexAttribute(gl, "vertexColor",    gl.FLOAT, 3, 
                                  vcolor);
   
}        
    

/* 

   Class:  TriangleFan
   A little fan around a center vertex. 
    
   Parameters to the constructor:
   - program is a Program object that knows which vertex attributes 
     are expected by its shaders
   
*/ 

TriangleFan = function(gl) {

    // instantiate the shape as a member variable
    this.shape = new VertexBasedShape(gl, gl.TRIANGLE_FAN, 9);

    var vposition = new Float32Array( [ 0,0,1,        0,1,0,       -0.7,0.7,0, 
                                        -1,0,0,      -0.7,-0.7,0,  0,-1,0, 
                                        0.7,-0.7,0,  1.0,0,0,      0.7,0.7,0]);
    var vcolor    = new Float32Array( [ 1,1,1,  1,0,0,  0,1,0,      
                                        0,0,1,  1,0,0,  0,1,0,  
                                        0,0,1,  1,0,0,  0,1,0 ]);
    this.shape.addVertexAttribute(gl, "vertexPosition", gl.FLOAT, 3, vposition);
    this.shape.addVertexAttribute(gl, "vertexColor",    gl.FLOAT, 3, vcolor);
    
}        
     

/* 

   Class:  Cube
   A little cube around the zero point.  
    
   Parameters to the constructor:
   - program is a Program object that knows which vertex attributes 
     are expected by its shaders
   
*/ 

Cube = function(gl, size) {
    // instantiate the shape as a member variable
    this.shape = new VertexBasedShape(gl, gl.TRIANGLES, 36);

    var s = size || 1.0; 

    var vposition = new Float32Array( [ 
        -s,-s, s,  s, s, s, -s, s, s, // a
        -s,-s, s,  s,-s, s,  s, s, s, // b 
         s,-s, s,  s,-s,-s,  s, s, s, // c 
         s,-s,-s,  s, s,-s,  s, s, s, // d 
         s, s, s,  s, s,-s, -s, s,-s, // e 
        -s, s,-s, -s, s, s,  s, s, s, // f 
        -s, s, s, -s,-s, s, -s,-s,-s, // g 
        -s, s, s, -s,-s,-s, -s, s,-s, // h 
        -s, s,-s, -s,-s,-s,  s,-s,-s, // i
         s,-s,-s,  s, s,-s, -s, s,-s, // j
        -s,-s,-s, -s,-s, s,  s,-s, s, // k
         s,-s, s,  s,-s,-s, -s,-s,-s // l 
    ]);

	var a = 1, b = 0, c = 0.5;                          

    var vcolor    = new Float32Array( [ 
        a,a,a, a,a,a, a,a,a, 
        a,a,b, a,a,b, a,a,b, 
        a,b,a, a,b,a, a,b,a, 
        a,b,b, a,b,b, a,b,b, 
        b,a,a, b,a,a, b,a,a, 
        b,a,b, b,a,b, b,a,b, 
        b,b,a, b,b,a, b,b,a, 
        a,a,c, a,a,c, a,a,c, 
        a,c,a, a,c,a, a,c,a, 
        a,c,c, a,c,c, a,c,c, 
        c,a,a, c,a,a, c,a,a, 
        c,a,c, c,a,c, c,a,c 
    ]);
    this.shape.addVertexAttribute(gl, "vertexPosition", gl.FLOAT, 3, vposition);
    this.shape.addVertexAttribute(gl, "vertexColor",    gl.FLOAT, 3, vcolor);
}        
    

/* 

   Class:  Sphere
   A little sphere around the zero point.  
    
   Parameters to the constructor:
   - program is a Program object that knows which vertex attributes 
     are expected by its shaders
   
*/ 

Sphere = function(gl, size) {
	var vertices = getSphereVertices(); 
	var indices = getSphereIndices();

	var vposition = makeFlat(vertices, indices); 

    // instantiate the shape as a member variable
    this.shape = new VertexBasedShape(gl, gl.TRIANGLES, vposition.length / 3);

    var s = size || 1.0; 
    
    this.shape.addVertexAttribute(gl, "vertexPosition", gl.FLOAT, 3, vposition);
}

function getSphereVertices() {
    var X = 0.525731112119133606;
    var Z = 0.850650808352039932;

	var v = [
        [-X, 0.0, Z], [X, 0.0, Z], [-X, 0.0, -Z], [X, 0.0, -Z],
        [0.0, Z, X], [0.0, Z, -X], [0.0, -Z, X], [0.0, -Z, -X],
        [Z, X, 0.0], [-Z, X, 0.0], [Z, -X, 0.0], [-Z, -X, 0.0]
    ]

    return v; 
}
    
function getSphereIndices() {
    var i = [
        [0,4,1],  [0,9,4],  [9,5,4],  [4,5,8],  [4,8,1],
        [8,10,1], [8,3,10], [5,3,8],  [5,2,3],  [2,7,3],
        [7,10,3], [7,6,10], [7,11,6], [11,0,6], [0,1,6],
        [6,1,10], [9,0,11], [9,11,2], [9,2,5],  [7,2,11]
    ];

    return i; 
}

function makeFlat(vertices, indeces) {
    var list = [];
    for(var i = 0; i != indeces.length; i++) {
        var indece = indeces[i]; 
 
        pushTriangle( list, vertices[indece[0]][0], vertices[indece[0]][1], vertices[indece[0]][2] );  
        pushTriangle( list, vertices[indece[1]][0], vertices[indece[1]][1], vertices[indece[1]][2] );  
        pushTriangle( list, vertices[indece[2]][0], vertices[indece[2]][1], vertices[indece[2]][2] );  
    }

    return new Float32Array(list); 
}

function pushTriangle(list, v1, v2, v3) {
    list.push(v1, v2, v3); 
}




