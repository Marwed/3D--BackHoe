////////////////////////////////////////////////////////////////////////
//
//	Hierarchical modeling with preorder tree traversal.
//
//	Matthew Marquis-Wedderburn
//	4/10
//	
//
// 	MultiJointModel.js (c) 2012 matsuda and itami
//
//	COSC 3307 WI 2017
//
////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////
// 	Vertex shader program
//////////////////////////////////////////////
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_Normal;\n' +
  'uniform mat4 u_MvpMatrix;\n' +
  'uniform mat4 u_NormalMatrix;\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  gl_Position = u_MvpMatrix * a_Position;\n' +
  // Shading calculation to make the arm look three-dimensional
  '  vec3 lightDirection = normalize(vec3(0.0, 0.5, 0.7));\n' + // Light direction
  '  vec4 color = vec4(0.2, 0.8, 0.3, 1.0);\n' +  // Green Backhoe
  '  vec3 normal = normalize((u_NormalMatrix * a_Normal).xyz);\n' +
  '  float nDotL = max(dot(normal, lightDirection), 0.0);\n' +
  '  v_Color = vec4(color.rgb * nDotL + vec3(0.1), color.a);\n' +
  '}\n';

//////////////////////////////////////////////
// 	Fragment shader program
//////////////////////////////////////////////
var FSHADER_SOURCE =
  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  '#endif\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  gl_FragColor = v_Color;\n' +
  '}\n';
  

//////////////////////////////////////////////////////////////
//
//	Draw function.
//	Pre-order traversal.
//	Visitation ==> draw the node.
//
//////////////////////////////////////////////////////////////
function draw(root) {
	if (root == null) { 
	  return;
	}
	
	pushMatrix(g_modelMatrix);
	root.drawFn();
	if (root.child != null) {
	    draw(root.child);
	}
	
	g_modelMatrix = popMatrix();
	if (root.sibling != null) {
	    draw(root.sibling);
	}
}	// draw





//	GLOBAL

var gl;
var n;
var viewProjMatrix;
var u_MvpMatrix;
var u_NormalMatrix;
var parms;


	
//	Main

function main() {
  
  // Retrieve <canvas> element
  var canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  ///////////////////////////////////////////////////////////////////////
  //	
  //	Get form and...
  //		Get values from sliders.
  //
  ///////////////////////////////////////////////////////////////////////
  var form = document.getElementById('formSliders');
  parms = new Object(); 
  var parmsDefault = new Object();

  // For accessing fields within the 'parms' object.
  var field;
  
  console.log('-- FIELD --');
  for (var i = 0; i < form.elements.length; i++) {
	field = form.elements[i];
	parms[field.name] = parseFloat(field.value);
	parmsDefault[field.name] = parseFloat(field.value);
  }
  console.log(parms);

  
  // Resent button is not part of the form.
  var resetButton = document.getElementById('resetButton');
 


  // Set the vertex information
  n = initVertexBuffers();
  if (n < 0) {
    console.log('Failed to set the vertex information');
    return;
  }

  // Set the clear color and enable the depth test
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);

  // Get the storage locations of uniform variables
  u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
  u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
  if (!u_MvpMatrix || !u_NormalMatrix) {
    console.log('Failed to get the storage location');
    return;
  }

  // Calculate the view projection matrix
  viewProjMatrix = new Matrix4();
  viewProjMatrix.setPerspective(50.0, canvas.width / canvas.height, 1.0, 100.0);
  viewProjMatrix.lookAt(20.0, 10.0, 40.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);

   gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
   draw(body); // Draw the body
 
 
  /////////////////////////////////////////////////////
  //
  //		Form change (for sliders)....
  //
  /////////////////////////////////////////////////////
  form.oninput = function(ev) {
    var evtemp = ev.srcElement;
    var id = evtemp['id'];
    var slider = document.getElementById(id);
    parms[slider.name] = parseFloat(slider.value);
    
	// Redraw.
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    draw(body); // Draw the body
  }

 
 
  
  //////////////////////////
  //	Reset
  //////////////////////////
  resetButton.onclick = function(ev) {
    /////////////////////////////////////
    //	Controls
    /////////////////////////////////////
    for (var i = 0; i < form.elements.length; i++) {
	  field = form.elements[i];
	  field.value = parmsDefault[field.name];
	  parms[field.name] = parmsDefault[field.name];
	}
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    draw(body); // Draw the robot arm
    

  }  // Reset
 
}	// main


//////////////////////////////////////////////////////////
//
//	Globals
//
//////////////////////////////////////////////////////////
var ANGLE_STEP = 3.0;     // The increments of rotation angle (degrees)
var g_arm1Angle = 90.0;   // The rotation angle of arm1 (degrees)
var g_joint1Angle = 45.0; // The rotation angle of joint1 (degrees)
var g_joint2Angle = 0.0;  // The rotation angle of joint2 (degrees)
var g_joint3Angle = 0.0;  // The rotation angle of joint3 (degrees)




//////////////////////////////////////////////////////////
//
//	Generate geometry and normals, and housekeeping.
//
//////////////////////////////////////////////////////////
function initVertexBuffers() {
  // Coordinates(Cube which length of one side is 1 with the origin on the center of the bottom)
  var vertices = new Float32Array([
    0.5, 1.0, 0.5, -0.5, 1.0, 0.5, -0.5, 0.0, 0.5,  0.5, 0.0, 0.5, // v0-v1-v2-v3 front
    0.5, 1.0, 0.5,  0.5, 0.0, 0.5,  0.5, 0.0,-0.5,  0.5, 1.0,-0.5, // v0-v3-v4-v5 right
    0.5, 1.0, 0.5,  0.5, 1.0,-0.5, -0.5, 1.0,-0.5, -0.5, 1.0, 0.5, // v0-v5-v6-v1 up
   -0.5, 1.0, 0.5, -0.5, 1.0,-0.5, -0.5, 0.0,-0.5, -0.5, 0.0, 0.5, // v1-v6-v7-v2 left
   -0.5, 0.0,-0.5,  0.5, 0.0,-0.5,  0.5, 0.0, 0.5, -0.5, 0.0, 0.5, // v7-v4-v3-v2 down
    0.5, 0.0,-0.5, -0.5, 0.0,-0.5, -0.5, 1.0,-0.5,  0.5, 1.0,-0.5  // v4-v7-v6-v5 back
  ]);

  // Normal
  var normals = new Float32Array([
    0.0, 0.0, 1.0,  0.0, 0.0, 1.0,  0.0, 0.0, 1.0,  0.0, 0.0, 1.0, // v0-v1-v2-v3 front
    1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0, // v0-v3-v4-v5 right
    0.0, 1.0, 0.0,  0.0, 1.0, 0.0,  0.0, 1.0, 0.0,  0.0, 1.0, 0.0, // v0-v5-v6-v1 up
   -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, // v1-v6-v7-v2 left
    0.0,-1.0, 0.0,  0.0,-1.0, 0.0,  0.0,-1.0, 0.0,  0.0,-1.0, 0.0, // v7-v4-v3-v2 down
    0.0, 0.0,-1.0,  0.0, 0.0,-1.0,  0.0, 0.0,-1.0,  0.0, 0.0,-1.0  // v4-v7-v6-v5 back
  ]);

  // Indices of the vertices
  var indices = new Uint8Array([
     0, 1, 2,   0, 2, 3,    // front
     4, 5, 6,   4, 6, 7,    // right
     8, 9,10,   8,10,11,    // up
    12,13,14,  12,14,15,    // left
    16,17,18,  16,18,19,    // down
    20,21,22,  20,22,23     // back
  ]);

  // Write the vertex property to buffers (coordinates and normals)
  if (!initArrayBuffer('a_Position', vertices, gl.FLOAT, 3)) return -1;
  if (!initArrayBuffer('a_Normal', normals, gl.FLOAT, 3)) return -1;

  // Unbind the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  // Write the indices to the buffer object
  var indexBuffer = gl.createBuffer();
  if (!indexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  return indices.length;
}	// initVertexBuffers


//////////////////////////////////////////////////////////
//
//	Boilerplate for intializing array buffers (position, normal).
//
//////////////////////////////////////////////////////////
function initArrayBuffer(attribute, data, type, num) {
  // Create a buffer object
  var buffer = gl.createBuffer();
  if (!buffer) {
    console.log('Failed to create the buffer object');
    return false;
  }
  // Write date into the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

  // Assign the buffer object to the attribute variable
  var a_attribute = gl.getAttribLocation(gl.program, attribute);
  if (a_attribute < 0) {
    console.log('Failed to get the storage location of ' + attribute);
    return false;
  }
  gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
  // Enable the assignment of the buffer object to the attribute variable
  gl.enableVertexAttribArray(a_attribute);

  return true;
}	// initArrayBuffer

// Coordinate transformation matrix
var g_modelMatrix = new Matrix4(), g_mvpMatrix = new Matrix4();






//////////////////////////////////////////////////////
//
//	Stack operations (push, pop)
//
//////////////////////////////////////////////////////
var g_matrixStack = []; // Array for storing a matrix

function pushMatrix(m) { // Store the specified matrix to the array
  var m2 = new Matrix4(m);
  g_matrixStack.push(m2);
}	// pushMatrix

function popMatrix() { // Retrieve the matrix from the array
  return g_matrixStack.pop();
} 	// popMatrix

var g_normalMatrix = new Matrix4();  // Coordinate transformation matrix for normals

//////////////////////////////////////////////////////////
//
//	Draw a single rectangular solid.
//
//////////////////////////////////////////////////////////
function drawBox(width, height, depth) {
  pushMatrix(g_modelMatrix);   // Save the model matrix
    // Scale a cube and draw
    g_modelMatrix.scale(width, height, depth);
    // Calculate the model view project matrix and pass it to u_MvpMatrix
    g_mvpMatrix.set(viewProjMatrix);
    g_mvpMatrix.multiply(g_modelMatrix);
    gl.uniformMatrix4fv(u_MvpMatrix, false, g_mvpMatrix.elements);
    // Calculate the normal transformation matrix and pass it to u_NormalMatrix
    g_normalMatrix.setInverseOf(g_modelMatrix);
    g_normalMatrix.transpose();
    gl.uniformMatrix4fv(u_NormalMatrix, false, g_normalMatrix.elements);
    // Draw
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
  g_modelMatrix = popMatrix();   // Retrieve the model matrix
}	// drawBox