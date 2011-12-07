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

	var vposition = makeFlatWithSubdivision(vertices, indices, 3); 

    // instantiate the shape as a member variable
    this.shape = new VertexBasedShape(gl, gl.TRIANGLES, vposition.length / 3);

    var s = size || 1.0;

	if(s !== 1.0) {
		for(var i = 0; i != vposition.length; i++) {
			vposition[i] = s * vposition[i]; 
		}
	} 
    
    this.shape.addVertexAttribute(gl, "vertexPosition", gl.FLOAT, 3, vposition);
}


Torus = function(gl, torusRadius, radius, sides, rings) {
	var vertices = getTorusVertices(torusRadius, radius, sides, rings);  

	var vposition = new Float32Array( vertices );  

    // instantiate the shape as a member variable
    this.shape = new VertexBasedShape(gl, gl.TRIANGLES, vposition.length / 3);

    this.shape.addVertexAttribute(gl, "vertexPosition", gl.FLOAT, 3, vposition);
}



function getTorusVertices(torusRadius, radius, sides, rings) {
	"use strict"; 

	var i, j, 
		theta, phi, theta1, 
		cosTheta, sinTheta, 
		cosTheta1, sinTheta1, 
		ringDelta, sideDelta, 
		cosPhi, sinPhi, dist,
		v1, v2,  
		list; 

	list = []; 
	sideDelta = 2.0 * Math.PI / sides; 
	ringDelta = 2.0 * Math.PI / rings; 
	theta = 0.0; 
	cosTheta = 1.0; 
	sinTheta = 0.0; 

	//list = []; 
	//glNewList
	for(i = rings - 1; i != 0; i--) {
		theta1 = theta + ringDelta; 
		cosTheta1 = Math.cos(theta1); 
		sinTheta1 = Math.sin(theta1); 
		//glBegin(QUAD)
		phi = 0; 
		for(j = sides; j != 0; j--) {
			phi = phi + sideDelta; 
			cosPhi = Math.cos(phi); 
			sinPhi = Math.sin(phi); 
			dist = radius + (torusRadius * cosPhi); 
			
			//glNormal
			v1 = [cosTheta1 * dist, -sinTheta1 * dist, torusRadius * sinPhi]; 

			//glNormal
			v2 = [cosTheta * dist, -sinTheta * dist, torusRadius * sinPhi]; 
			pushQuadAsTriangles(list, v1, v2); 
		}
		//glEnd
		theta = theta1; 
		cosTheta = cosTheta1; 
		sinTheta = sinTheta1; 
	}
	//glEndList

	return list; 
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

function makeFlatWithSubdivision(vertices, indeces, level) {
    var list = [];

    for(var i = 0; i != indeces.length; i++) {
        var indece = indeces[i]; 
        var v1, v2, v3;
         
        v1 = vertices[indece[0]];
        v2 = vertices[indece[1]]; 
        v3 = vertices[indece[2]];   

		if(level === 0) {
        	pushTriangle(list, v1, v2, v3);
		} 
		else {
			subdivide(list, v1, v2, v3, level - 1); 
		}
    }

    return new Float32Array(list); 
}

function subdivide(list, v1, v2, v3, level) {
	var v12, v23, v31; 
	v12 = [
		v1[0] + v2[0], 
		v1[1] + v2[1], 
		v1[2] + v2[2] 
	]; 
	normalize(v12); 

	v23 = [
		v2[0] + v3[0], 
		v2[1] + v3[1], 
		v2[2] + v3[2] 
	]; 
	normalize(v23); 

	v31 = [
		v3[0] + v1[0], 
		v3[1] + v1[1], 
		v3[2] + v1[2] 
	]; 
	normalize(v31); 

	if(level === 0) {
		pushTriangle(list, v1, v12, v31); 
		pushTriangle(list, v2, v23, v12); 
		pushTriangle(list, v3, v31, v23); 
		pushTriangle(list, v12, v23, v31); 
	}
	else {
		subdivide(list, v1, v12, v31, level - 1); 
		subdivide(list, v2, v23, v12, level - 1); 
		subdivide(list, v3, v31, v23, level - 1); 
		subdivide(list, v12, v23, v31, level - 1); 	
	}

}

function normalize(v) {
	var l = Math.sqrt( v[0]*v[0] + v[1]*v[1] + v[2]*v[2] );

	v[0] = v[0] / l;  
	v[1] = v[1] / l;  
	v[2] = v[2] / l;  
}

function makeFlat(vertices, indeces) {
    var list = [];

    for(var i = 0; i != indeces.length; i++) {
        var indece = indeces[i]; 
        var v1, v2, v3;
         
        v1 = vertices[indece[0]];
        v2 = vertices[indece[1]]; 
        v3 = vertices[indece[2]];   

        pushTriangle(list, v1, v2, v3); 
    }

    return new Float32Array(list); 
}

function pushQuadAsTriangles(list, a, b) {
//	a---c
//	|  /|
//	| / |
//	|/  |
//	d---b
	//Angenommen a.z == b.z 
	var c, d; 
	c = [b[0], a[1], a[2]]; 
	d = [a[0], b[1], b[2]]; 

	pushTriangle(list, a, d, c); 
	pushTriangle(list, c, d, b); 
}

function pushTriangle(list, v1, v2, v3) {
	pushVertex(list, v1); 
	pushVertex(list, v2); 
	pushVertex(list, v3); 
}

function pushVertex(list, v) {
	list.push( v[0], v[1], v[2] ); 
}




