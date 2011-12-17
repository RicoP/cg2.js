/*
 * WebGL / Javascript tutorial.
 * Author: Hartmut Schirmacher, hschirmacher.beuth-hochschule.de
 * (C)opyright 2011 by Hartmut Schirmacher, all rights reserved. 
 *
 */


/* 

   The "Main" Function is an event handler that is called 
   whenever the HTML document is loaded/refreshed
*/

window.onload = function () {

    // initialize WebGL and compile shader program
    var canvas = window.document.getElementById("webgl_canvas");
    var gl = initWebGL("webgl_canvas");
    var vs = getShaderSource("vert_shader");
    var fs = getShaderSource("frag_shader");
    var prog = new Program(gl, vs, fs);
	var trans = mat4.identity(); 
	
	// Ugh! 
	window.gl = gl; 
    
    // theScene is a global variable; it is accessed by the event handlers
    theScene = new SimpleScene(prog, [0.0 ,0.0, 0.0, 1.0]);
    
    // add an object to the scene
    //theScene.addShape(new CSGTest(gl));
    
    // set the camera's viewpoint and viewing direction
    theScene.camera.lookAt([0,2,4], [0,0,0], [0,1,0]);
    
    // use the values in the HTML form to initialize the camera's projection
    updateCamera(theScene); 
    
    // the SceneExporer handles events to manipulate the scene
    theExplorer = new SceneExplorer(canvas,theScene);

	populateTable(gl, trans); 
};

function populateTable(gl, theMatrix) {
	"use strict"; 

	var div, table, i, r, c, td, tr, edit; 

	div = document.getElementById("matrixHolder"); 
	table = document.createElement("table"); 

	i = 0; 

	for( r = 0; r != 4; r++ ) {
		tr = document.createElement("tr"); 
		for( c = 0; c != 4; c++ ) {
			td = document.createElement("td"); 
			edit = document.createElement("input"); 
			edit.type = "text"; 
			edit.value = ( i % 5 === 0 ) ? 1 : 0; // diagonale = 1
			
			(function (i, edit) {
				edit.onchange = function() {
					if(!isNaN(edit.value)) { 
						theMatrix[i] = Number(edit.value); 
					} 
				}; 
			}(i, edit)); 
			i++; 

			td.appendChild(edit); 
			tr.appendChild(td); 
		}
		table.appendChild(tr); 
	}

	div.appendChild(table); 
}

/*
    Event handler called whenever values in the 
    "cameraParameters" form have been updated.
    
    The function simply reads values from the HTML form
    and calls the respective functions of the scene's 
    camera object.
*/
     
updateCamera = function(scene) {

    var f = document.forms["cameraParameters"];
    var cam = scene.camera;
    
    if(!f) {
        window.console.log("ERROR: Could not find HTML form named 'projectionParameters'.");
        return;
    }
    
    // check which projection type to use (0 = perspective; 1 = ortho)
    if(f.elements["projection_type"][0].checked == true) {
    
        // perspective projection: fovy, aspect, near, far
        if(!cam)
            alert("Cannot find camera object!!!");

        // update camera - set up perspective projection
        cam.perspective(parseFloat(f.elements["fovy"].value), 
                        1.0, // aspect
                        parseFloat(f.elements["znear"].value),
                        parseFloat(f.elements["zfar"].value)   );
        scene.draw();
        
    } else {

        // update camera - set up orthographic projection
        cam.orthographic(parseFloat(f.elements["left"].value),  parseFloat(f.elements["right"].value),
                         parseFloat(f.elements["bot"].value),   parseFloat(f.elements["top"].value),
                         parseFloat(f.elements["front"].value), parseFloat(f.elements["back"].value)  );
        scene.draw();
    }
  
}


