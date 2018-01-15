// cuon-utils.js (c) 2012 kanda and matsuda
/**
 * ãƒ—ãƒ­ã‚°ãƒ©ãƒ ã‚ªãƒ–ã‚¸ã‚§ã‚¯ãƒˆã‚’ç”Ÿæˆ?ã?—ã€?ã‚«ãƒ¬ãƒ³ãƒˆã?«è¨­å®šã?™ã‚‹
 * @param gl GLã‚³ãƒ³ãƒ†ã‚­ã‚¹ãƒˆ
 * @param vshader é ‚ç‚¹ã‚·ã‚§ãƒ¼ãƒ€ã?®ãƒ—ãƒ­ã‚°ãƒ©ãƒ (æ–‡å­—åˆ—)
 * @param fshader ãƒ•ãƒ©ã‚°ãƒ¡ãƒ³ãƒˆã‚·ã‚§ãƒ¼ãƒ€ã?®ãƒ—ãƒ­ã‚°ãƒ©ãƒ (æ–‡å­—åˆ—)
 * @return ãƒ—ãƒ­ã‚°ãƒ©ãƒ ã‚ªãƒ–ã‚¸ã‚§ã‚¯ãƒˆã‚’ç”Ÿæˆ?ã?—ã€?ã‚«ãƒ¬ãƒ³ãƒˆã?®è¨­å®šã?«æˆ?åŠŸã?—ã?Ÿã‚‰true
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
 * ãƒªãƒ³ã‚¯æ¸ˆã?¿ã?®ãƒ—ãƒ­ã‚°ãƒ©ãƒ ã‚ªãƒ–ã‚¸ã‚§ã‚¯ãƒˆã‚’ç”Ÿæˆ?ã?™ã‚‹
 * @param gl GLã‚³ãƒ³ãƒ†ã‚­ã‚¹ãƒˆ
 * @param vshader é ‚ç‚¹ã‚·ã‚§ãƒ¼ãƒ€ã?®ãƒ—ãƒ­ã‚°ãƒ©ãƒ (æ–‡å­—åˆ—)
 * @param fshader ãƒ•ãƒ©ã‚°ãƒ¡ãƒ³ãƒˆã‚·ã‚§ãƒ¼ãƒ€ã?®ãƒ—ãƒ­ã‚°ãƒ©ãƒ (æ–‡å­—åˆ—)
 * @return ä½œæˆ?ã?—ã?Ÿãƒ—ãƒ­ã‚°ãƒ©ãƒ ã‚ªãƒ–ã‚¸ã‚§ã‚¯ãƒˆã€‚ä½œæˆ?ã?«å¤±æ•—ã?—ã?Ÿå ´å?ˆã?¯null
 */
function createProgram(gl, vshader, fshader) {
  // ã‚·ã‚§ãƒ¼ãƒ€ã‚ªãƒ–ã‚¸ã‚§ã‚¯ãƒˆã‚’ä½œæˆ?ã?™ã‚‹
  var vertexShader = loadShader(gl, gl.VERTEX_SHADER, vshader);
  var fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fshader);
  if (!vertexShader || !fragmentShader) {
    return null;
  }

  // ãƒ—ãƒ­ã‚°ãƒ©ãƒ ã‚ªãƒ–ã‚¸ã‚§ã‚¯ãƒˆã‚’ä½œæˆ?ã?™ã‚‹
  var program = gl.createProgram();
  if (!program) {
    return null;
  }

  // ã‚·ã‚§ãƒ¼ãƒ€ã‚ªãƒ–ã‚¸ã‚§ã‚¯ãƒˆã‚’è¨­å®šã?™ã‚‹
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  // ãƒ—ãƒ­ã‚°ãƒ©ãƒ ã‚ªãƒ–ã‚¸ã‚§ã‚¯ãƒˆã‚’ãƒªãƒ³ã‚¯ã?™ã‚‹
  gl.linkProgram(program);

  // ãƒªãƒ³ã‚¯çµ?æžœã‚’ãƒ?ã‚§ãƒƒã‚¯ã?™ã‚‹
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
 * ã‚·ã‚§ãƒ¼ãƒ€ã‚ªãƒ–ã‚¸ã‚§ã‚¯ãƒˆã‚’ä½œæˆ?ã?™ã‚‹
 * @param gl GLã‚³ãƒ³ãƒ†ã‚­ã‚¹ãƒˆ
 * @param type ä½œæˆ?ã?™ã‚‹ã‚·ã‚§ãƒ¼ãƒ€ã‚¿ã‚¤ãƒ—
 * @param source ã‚·ã‚§ãƒ¼ãƒ€ã?®ãƒ—ãƒ­ã‚°ãƒ©ãƒ (æ–‡å­—åˆ—)
 * @return ä½œæˆ?ã?—ã?Ÿã‚·ã‚§ãƒ¼ãƒ€ã‚ªãƒ–ã‚¸ã‚§ã‚¯ãƒˆã€‚ä½œæˆ?ã?«å¤±æ•—ã?—ã?Ÿå ´å?ˆã?¯null
 */
function loadShader(gl, type, source) {
  // ã‚·ã‚§ãƒ¼ãƒ€ã‚ªãƒ–ã‚¸ã‚§ã‚¯ãƒˆã‚’ä½œæˆ?ã?™ã‚‹
  var shader = gl.createShader(type);
  if (shader == null) {
    console.log('unable to create shader');
    return null;
  }

  // ã‚·ã‚§ãƒ¼ãƒ€ã?®ãƒ—ãƒ­ã‚°ãƒ©ãƒ ã‚’è¨­å®šã?™ã‚‹
  gl.shaderSource(shader, source);

  // ã‚·ã‚§ãƒ¼ãƒ€ã‚’ã‚³ãƒ³ãƒ‘ã‚¤ãƒ«ã?™ã‚‹
  gl.compileShader(shader);

  // ã‚³ãƒ³ãƒ‘ã‚¤ãƒ«çµ?æžœã‚’æ¤œæŸ»ã?™ã‚‹
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
 * attributeå¤‰æ•°ã€?uniformå¤‰æ•°ã?®ä½?ç½®ã‚’å?–å¾—ã?™ã‚‹
 * @param gl GLã‚³ãƒ³ãƒ†ã‚­ã‚¹ãƒˆ
 * @param program ãƒªãƒ³ã‚¯æ¸ˆã?¿ã?®ãƒ—ãƒ­ã‚°ãƒ©ãƒ ã‚ªãƒ–ã‚¸ã‚§ã‚¯ãƒˆ
 */
function loadVariableLocations(gl, program) {
  var i, name;

  // å¤‰æ•°ã?®æ•°ã‚’å?–å¾—ã?™ã‚‹
  var attribCount = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
  var uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);

  // attributeå¤‰æ•°ã?®ä½?ç½®ã?¨å??å‰?ã?®å¯¾å¿œã‚’å?–å¾—ã?™ã‚‹
  var attribIndex = {};
  for (i = 0; i < attribCount; ++i) {
    name = gl.getActiveAttrib(program, i).name;
    attribIndex[name] = i;
  }

  // uniformå¤‰æ•°ã?®ä½?ç½®ã?¨å??å‰?ã?®å¯¾å¿œã‚’å?–å¾—ã?™ã‚‹
  var uniformLoc = {};
  for (i = 0; i < uniformCount; ++i) {
    name = gl.getActiveUniform(program, i).name;
    uniformLoc[name] = gl.getUniformLocation(program, name);
  }

  // å?–å¾—ã?—ã?Ÿä½?ç½®ã‚’ãƒ—ãƒ­ã‚°ãƒ©ãƒ ã‚ªãƒ–ã‚¸ã‚§ã‚¯ãƒˆã?®ãƒ—ãƒ­ãƒ‘ãƒ†ã‚£ã?¨ã?—ã?¦ä¿?å­˜ã?™ã‚‹
  program.attribIndex = attribIndex;
  program.uniformLoc = uniformLoc;
}

/** 
 * ã‚³ãƒ³ãƒ†ã‚­ã‚¹ãƒˆã‚’åˆ?æœŸåŒ–ã?—ã?¦å?–å¾—ã?™ã‚‹
 * @param canvas æ??ç”»å¯¾è±¡ã?®Cavnasè¦?ç´ 
 * @param opt_debug ãƒ‡ãƒ?ãƒƒã‚°ç”¨ã?®åˆ?æœŸåŒ–ã‚’ã?™ã‚‹ã?‹
 * @return åˆ?æœŸåŒ–ã‚’å®Œäº†ã?—ã?ŸGLã‚³ãƒ³ãƒ†ã‚­ã‚¹ãƒˆ
 */
function getWebGLContext(canvas, opt_debug) {
  // ã‚³ãƒ³ãƒ†ã‚­ã‚¹ãƒˆã‚’å?–å¾—ã?™ã‚‹
  var gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) return null;

  // opt_debugã?«æ˜Žç¤ºçš„ã?«falseã?Œæ¸¡ã?•ã‚Œã?ªã?‘ã‚Œã?°ã€?ãƒ‡ãƒ?ãƒƒã‚°ç”¨ã?®ã‚³ãƒ³ãƒ†ã‚­ã‚¹ãƒˆã‚’ä½œæˆ?ã?™ã‚‹
  if (arguments.length < 2 || opt_debug) {
    gl = WebGLDebugUtils.makeDebugContext(gl);
  }

  return gl;
}
