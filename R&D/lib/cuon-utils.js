// cuon-utils.js (c) 2012 kanda and matsuda
/**
 * プログラ� オブジェクトを生�?�?��?カレント�?�設定�?�る
 * @param gl GLコンテキスト
 * @param vshader � �点シェーダ�?�プログラ� (文字列)
 * @param fshader フラグメントシェーダ�?�プログラ� (文字列)
 * @return プログラ� オブジェクトを生�?�?��?カレント�?�設定�?��?功�?��?�らtrue
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
 * リンク済�?��?�プログラ� オブジェクトを生�?�?�る
 * @param gl GLコンテキスト
 * @param vshader � �点シェーダ�?�プログラ� (文字列)
 * @param fshader フラグメントシェーダ�?�プログラ� (文字列)
 * @return 作�?�?��?�プログラ� オブジェクト。作�?�?�失敗�?��?�� ��?��?�null
 */
function createProgram(gl, vshader, fshader) {
  // シェーダオブジェクトを作�?�?�る
  var vertexShader = loadShader(gl, gl.VERTEX_SHADER, vshader);
  var fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fshader);
  if (!vertexShader || !fragmentShader) {
    return null;
  }

  // プログラ� オブジェクトを作�?�?�る
  var program = gl.createProgram();
  if (!program) {
    return null;
  }

  // シェーダオブジェクトを設定�?�る
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  // プログラ� オブジェクトをリンク�?�る
  gl.linkProgram(program);

  // リンク�?果を�?ェック�?�る
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
 * シェーダオブジェクトを作�?�?�る
 * @param gl GLコンテキスト
 * @param type 作�?�?�るシェーダタイプ
 * @param source シェーダ�?�プログラ� (文字列)
 * @return 作�?�?��?�シェーダオブジェクト。作�?�?�失敗�?��?�� ��?��?�null
 */
function loadShader(gl, type, source) {
  // シェーダオブジェクトを作�?�?�る
  var shader = gl.createShader(type);
  if (shader == null) {
    console.log('unable to create shader');
    return null;
  }

  // シェーダ�?�プログラ� を設定�?�る
  gl.shaderSource(shader, source);

  // シェーダをコンパイル�?�る
  gl.compileShader(shader);

  // コンパイル�?果を検査�?�る
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
 * attribute変数�?uniform変数�?��?置を�?�得�?�る
 * @param gl GLコンテキスト
 * @param program リンク済�?��?�プログラ� オブジェクト
 */
function loadVariableLocations(gl, program) {
  var i, name;

  // 変数�?�数を�?�得�?�る
  var attribCount = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
  var uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);

  // attribute変数�?��?置�?��??�?�?�対応を�?�得�?�る
  var attribIndex = {};
  for (i = 0; i < attribCount; ++i) {
    name = gl.getActiveAttrib(program, i).name;
    attribIndex[name] = i;
  }

  // uniform変数�?��?置�?��??�?�?�対応を�?�得�?�る
  var uniformLoc = {};
  for (i = 0; i < uniformCount; ++i) {
    name = gl.getActiveUniform(program, i).name;
    uniformLoc[name] = gl.getUniformLocation(program, name);
  }

  // �?�得�?��?��?置をプログラ� オブジェクト�?�プロパティ�?��?��?��?存�?�る
  program.attribIndex = attribIndex;
  program.uniformLoc = uniformLoc;
}

/** 
 * コンテキストを�?期化�?��?��?�得�?�る
 * @param canvas �??画対象�?�Cavnas�?� 
 * @param opt_debug デ�?ッグ用�?��?期化を�?�る�?�
 * @return �?期化を完了�?��?�GLコンテキスト
 */
function getWebGLContext(canvas, opt_debug) {
  // コンテキストを�?�得�?�る
  var gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) return null;

  // opt_debug�?�明示的�?�false�?�渡�?�れ�?��?�れ�?��?デ�?ッグ用�?�コンテキストを作�?�?�る
  if (arguments.length < 2 || opt_debug) {
    gl = WebGLDebugUtils.makeDebugContext(gl);
  }

  return gl;
}
