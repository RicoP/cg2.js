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

window.onload = function() {

	// initialize WebGL and compile shader program
	var canvas = window.document.getElementById("webgl_canvas");
	var gl = initWebGL("webgl_canvas");
	var vs = getShaderSource("vert_shader");
	var fs = getShaderSource("frag_shader");
	var prog = new Program(gl, vs, fs);

	// theScene is a global variable; it is accessed by the event handlers
	theScene = new SimpleScene(prog, [0.0, 0.0, 0.0, 1.0]);

	// set the camera's viewpoint and viewing direction
	theScene.camera.lookAt([0, 2, 4], [0, 0, 0], [0, 1, 0]);

	// use the values in the HTML form to initialize the camera's projection
	updateCamera(theScene);

	// the SceneExporer handles events to manipulate the scene
	theExplorer = new SceneExplorer(canvas, theScene);

	// add all three objects to the scene
	var c1 = [0.9, 0.1, 0.1];
	var c2 = [0.1, 0.1, 0.9];
	
	var c3 = [0.9, 0.9, 0.0];
	var c4 = [0.9, 0.0, 0.0];

	// the shapes
	var sphere = new Sphere(gl, 1.5);
	var torus = new MyTorus(gl, 0.6, 0.3, 30, 30, c1, c2, 0);
	var cube = new Cube(gl);
	var torus2 = new MyTorus(gl, 0.9, 0.5, 100, 100, c3, c4, 1);
	mat4.translate(torus2.shape.modelTranslation, [1, 0, 0]);
	mat4.translate(torus.shape.modelTranslation, [2, -3, 0]);
	mat4.translate(cube.shape.modelTranslation, [-1, 0, -3]);
	// theScene.addShape(sphere);
	theScene.addShape(torus);
	theScene.addShape(cube);
	theScene.addShape(torus2);
	theScene.draw();

};
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
		cam.perspective(parseFloat(f.elements["fovy"].value), 1.0, // aspect
		parseFloat(f.elements["znear"].value), parseFloat(f.elements["zfar"].value));
		scene.draw();

	} else {

		// update camera - set up orthographic projection
		cam.orthographic(parseFloat(f.elements["left"].value), parseFloat(f.elements["right"].value), parseFloat(f.elements["bot"].value), parseFloat(f.elements["top"].value), parseFloat(f.elements["front"].value), parseFloat(f.elements["back"].value));
		scene.draw();
	}

}