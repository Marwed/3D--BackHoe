// cuon-utils.js (c) 2012 kanda and matsuda
/**
 * ãã­ã°ã©ã ãªãã¸ã§ã¯ããçæ?ã?ã?ã«ã¬ã³ãã?«è¨­å®ã?ã
 * @param gl GLã³ã³ãã­ã¹ã
 * @param vshader é ç¹ã·ã§ã¼ãã?®ãã­ã°ã©ã (æå­å)
 * @param fshader ãã©ã°ã¡ã³ãã·ã§ã¼ãã?®ãã­ã°ã©ã (æå­å)
 * @return ãã­ã°ã©ã ãªãã¸ã§ã¯ããçæ?ã?ã?ã«ã¬ã³ãã?®è¨­å®ã?«æ?åã?ã?ãtrue
 */
function initShaders(gl, vshader, fshader) {
  var program = createProgram(gl, vshader, fshader);
  if (!program) {
    console.log('failed to create program');
    return false;
  }

  gl.useProgram(program);
  gl.program = program;

  return true;
}

/**
 * ãªã³ã¯æ¸ã?¿ã?®ãã­ã°ã©ã ãªãã¸ã§ã¯ããçæ?ã?ã
 * @param gl GLã³ã³ãã­ã¹ã
 * @param vshader é ç¹ã·ã§ã¼ãã?®ãã­ã°ã©ã (æå­å)
 * @param fshader ãã©ã°ã¡ã³ãã·ã§ã¼ãã?®ãã­ã°ã©ã (æå­å)
 * @return ä½æ?ã?ã?ãã­ã°ã©ã ãªãã¸ã§ã¯ããä½æ?ã?«å¤±æã?ã?å ´å?ã?¯null
 */
function createProgram(gl, vshader, fshader) {
  // ã·ã§ã¼ããªãã¸ã§ã¯ããä½æ?ã?ã
  var vertexShader = loadShader(gl, gl.VERTEX_SHADER, vshader);
  var fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fshader);
  if (!vertexShader || !fragmentShader) {
    return null;
  }

  // ãã­ã°ã©ã ãªãã¸ã§ã¯ããä½æ?ã?ã
  var program = gl.createProgram();
  if (!program) {
    return null;
  }

  // ã·ã§ã¼ããªãã¸ã§ã¯ããè¨­å®ã?ã
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  // ãã­ã°ã©ã ãªãã¸ã§ã¯ãããªã³ã¯ã?ã
  gl.linkProgram(program);

  // ãªã³ã¯çµ?æãã?ã§ãã¯ã?ã
  var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!linked) {
    var error = gl.getProgramInfoLog(program);
    console.log('failed to link program: ' + error);
    gl.deleteProgram(program);
    gl.deleteShader(fragmentShader);
    gl.deleteShader(vertexShader);
    return null;
  }
  return program;
}

/**
 * ã·ã§ã¼ããªãã¸ã§ã¯ããä½æ?ã?ã
 * @param gl GLã³ã³ãã­ã¹ã
 * @param type ä½æ?ã?ãã·ã§ã¼ãã¿ã¤ã
 * @param source ã·ã§ã¼ãã?®ãã­ã°ã©ã (æå­å)
 * @return ä½æ?ã?ã?ã·ã§ã¼ããªãã¸ã§ã¯ããä½æ?ã?«å¤±æã?ã?å ´å?ã?¯null
 */
function loadShader(gl, type, source) {
  // ã·ã§ã¼ããªãã¸ã§ã¯ããä½æ?ã?ã
  var shader = gl.createShader(type);
  if (shader == null) {
    console.log('unable to create shader');
    return null;
  }

  // ã·ã§ã¼ãã?®ãã­ã°ã©ã ãè¨­å®ã?ã
  gl.shaderSource(shader, source);

  // ã·ã§ã¼ããã³ã³ãã¤ã«ã?ã
  gl.compileShader(shader);

  // ã³ã³ãã¤ã«çµ?æãæ¤æ»ã?ã
  var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!compiled) {
    var error = gl.getShaderInfoLog(shader);
    console.log('failed to compile shader: ' + error);
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

/**
 * attributeå¤æ°ã?uniformå¤æ°ã?®ä½?ç½®ãå?å¾ã?ã
 * @param gl GLã³ã³ãã­ã¹ã
 * @param program ãªã³ã¯æ¸ã?¿ã?®ãã­ã°ã©ã ãªãã¸ã§ã¯ã
 */
function loadVariableLocations(gl, program) {
  var i, name;

  // å¤æ°ã?®æ°ãå?å¾ã?ã
  var attribCount = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
  var uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);

  // attributeå¤æ°ã?®ä½?ç½®ã?¨å??å?ã?®å¯¾å¿ãå?å¾ã?ã
  var attribIndex = {};
  for (i = 0; i < attribCount; ++i) {
    name = gl.getActiveAttrib(program, i).name;
    attribIndex[name] = i;
  }

  // uniformå¤æ°ã?®ä½?ç½®ã?¨å??å?ã?®å¯¾å¿ãå?å¾ã?ã
  var uniformLoc = {};
  for (i = 0; i < uniformCount; ++i) {
    name = gl.getActiveUniform(program, i).name;
    uniformLoc[name] = gl.getUniformLocation(program, name);
  }

  // å?å¾ã?ã?ä½?ç½®ããã­ã°ã©ã ãªãã¸ã§ã¯ãã?®ãã­ããã£ã?¨ã?ã?¦ä¿?å­ã?ã
  program.attribIndex = attribIndex;
  program.uniformLoc = uniformLoc;
}

/** 
 * ã³ã³ãã­ã¹ããå?æåã?ã?¦å?å¾ã?ã
 * @param canvas æ??ç»å¯¾è±¡ã?®Cavnasè¦?ç´ 
 * @param opt_debug ãã?ãã°ç¨ã?®å?æåãã?ãã?
 * @return å?æåãå®äºã?ã?GLã³ã³ãã­ã¹ã
 */
function getWebGLContext(canvas, opt_debug) {
  // ã³ã³ãã­ã¹ããå?å¾ã?ã
  var gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) return null;

  // opt_debugã?«æç¤ºçã?«falseã?æ¸¡ã?ãã?ªã?ãã?°ã?ãã?ãã°ç¨ã?®ã³ã³ãã­ã¹ããä½æ?ã?ã
  if (arguments.length < 2 || opt_debug) {
    gl = WebGLDebugUtils.makeDebugContext(gl);
  }

  return gl;
}
