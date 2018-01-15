////////////////////////////////////////////////////////////////////////////////
//
//	Hierarchy definition and drawing routines.
//
//	Matthew Marquis -Wedderburn
//	COSC 3307 WI 2017
//	4/10
//
////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////
//
//	Constructor for node.
//	Note the functional programming aspects of JS.
//
//////////////////////////////////////////////
function node(child, sibling, drawFn) {
	this.child = child;
	this.sibling = sibling;
	this.drawFn = drawFn;
}	// node 


  ////////////////////////////////////////////////////////
  //
  //	Set up objects....
  //
  ///////////////////////////////////////////////////////
  var body = new(node);
  var body2= new(node);
  var LFwheel = new(node);
  var Lfc = new(node);
  var Rfc = new(node);
  var  RFwheel= new(node);
  var LBwheel = new(node);
  var RBwheel = new(node);
  var back1 = new(node);
  var back2 = new(node);
  var FScoop = new(node);
  var Bscoop = new(node);
  var comp= new (node);
  
 
  /////////////////////////////////////
  //	Initialize members.
  /////////////////////////////////////
  body.child = LFwheel;
  body.sibling = body2;
  body.drawFn = drawBody;
  // wheels are childer of body
  body2.child=Lfc;
  body2.sibling=null;
  body2.drawFn=drawBody2;
   // body2 is sibling of wheels

  LFwheel.child = null;
  LFwheel.sibling = RFwheel;
  LFwheel.drawFn = drawLFwheel;
  
  RFwheel.child = null;
  RFwheel.sibling = LBwheel;
  RFwheel.drawFn = drawRFwheel;
   
  LBwheel.child = null;
  LBwheel.sibling = RBwheel;
  LBwheel.drawFn = drawLBwheel;

  RBwheel.child = null;
  RBwheel.sibling = back1;
  RBwheel.drawFn = drawRBwheel;
   
  Lfc.child = null;
  Lfc.sibling = Rfc;
  Lfc.drawFn = drawLfc;
// connector is child of body2
  Rfc.child = FScoop;
  Rfc.sibling = null;
  Rfc.drawFn = drawRfc;
   //right connector is siblingof l
  back1.child = comp;
  back1.sibling = null;
  back1.drawFn = drawback1;
  
  comp.child=back2;
  comp.sibling= null;
  comp.drawFn= drawcomp;

  back2.child = Bscoop;
  back2.sibling = null;
  back2.drawFn = drawback2;
   
  Bscoop.child = null;
  Bscoop.sibling = null;
  Bscoop.drawFn = drawBscoop;
  
  
 FScoop.child=null;
 FScoop.sibling=null;
 FScoop.drawFn= drawFScoop;


  


function drawBody() { 
	
	g_modelMatrix.setTranslate(0.0, -4.0, 0.0);
	g_modelMatrix.rotate(parms.xBody, 0.0, 1.0, 0.0); 
	drawBox(15, 10, 10);
}	// drawBody

function drawBody2() { 
	
	g_modelMatrix.setTranslate(0, 6.0, 0.0);
	g_modelMatrix.rotate(parms.xBody, 0.0, 1.0, 0.0); 
	drawBox(5, 5, 5);
}	// drawBody2



function drawLFwheel() { 
	
	g_modelMatrix.translate(-6, 0, 6);
    g_modelMatrix.rotate(parms.thetazwheel, 0.0, 0, 1); 
	
	drawBox(3, 3, 3);
}	// drawwheel

function drawLBwheel() { 
	
	// Draw the neck.
	g_modelMatrix.translate(6, 0, 8.0);
	g_modelMatrix.rotate(parms.thetazwheel, 0.0, 0, 1); 
	drawBox(6,6,6);
}	// drawwheel



function drawRBwheel() { 
	
 	g_modelMatrix.translate(6,0,-8);
 	
	g_modelMatrix.rotate(parms.thetazwheel, 0, 0.0, 1);
  
	drawBox(6, 6, 6);
}	// drawwheel

function drawRFwheel() { 
	
	g_modelMatrix.translate(-6, 0, -6);

	g_modelMatrix.rotate(parms.thetazwheel, 0, 0.0, 1);
	
	drawBox(3,3,3);
}	// drawWheel
 
function drawLfc() { 
	console.log('DRAWING LUA....');
 	g_modelMatrix.translate(-6,-4,4);
	g_modelMatrix.rotate(90, 0.0, 0.0, 1.0);
 	g_modelMatrix.rotate(parms.thetazRfC, 0, 0, 1);
 	
	drawBox(1, 5, 1);
}	// drawLeft connector

function drawRfc() { 
	
	g_modelMatrix.translate(-6, -4, -4);
	g_modelMatrix.rotate(90, 0.0, 0.0, 1.0);
	g_modelMatrix.rotate(parms.thetazRfC, 0, 0.0, 1);
	drawBox(1, 5, 1);
}	// drawright connector



function drawFScoop() { 
	
	
	g_modelMatrix.translate(-1,5,4);
	g_modelMatrix.shear2D(-0.3,-0.4);
  	g_modelMatrix.rotate(parms.thetazScoop, 0, 0.0, 1);
	
	drawBox(5, 5, 8);
}	// drawFrontScoop

function drawBscoop() { 
	
  	g_modelMatrix.rotate(parms.thetazBackscooper, 0, 0.0, 1);
	g_modelMatrix.translate(0.0, -6.5, 0.0);
	drawBox(2, 6.5, 2);
}// drawBackscoop

 function drawback1() { 
	
	g_modelMatrix.rotate(-15, 0, 0.0, 1);
   	g_modelMatrix.rotate(parms.thetazBack1, 0, 0.0, 1);
	g_modelMatrix.translate(5,7,0);
	drawBox(2, 12, 2);
}	// drawback1

function drawcomp() { 

		g_modelMatrix.rotate(90, 0, 0.0, 1);
		g_modelMatrix.translate(9, -4, 0.0);
  	g_modelMatrix.rotate(parms.thetaxBack2, 0, 0.0, 1);
	
	
	drawBox(1, 4, 1);
}	// drawcompressor


function drawback2() { 

		g_modelMatrix.rotate(-30, 0, 0.0, 1);
  	g_modelMatrix.rotate(parms.thetaxBack2, 0, 0.0, 1);
	
	g_modelMatrix.translate(0, -3, 0.0);
	drawBox(1, 6.5, 1);
}	// drawback2



