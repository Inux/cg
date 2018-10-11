//
// DI Computer Graphics
//
// WebGL Exercises
//

// Register function to call after document has loaded
window.onload = startup;

// the gl object is saved globally
var gl;

var model = {
    width: -1,
    height: -1,
    racketWidth: 10,
    racketHeight: 100,
    field: {
        buffer: -1,
        vertices: [],
        matrix: mat3.create(),
        y: 0
    },
    player1: {
        buffer: -1,
        vertices: [],
        matrix: mat3.create(),
        y: 0
    },
    player2: {
        buffer: -1,
        vertices: [],
        matrix: mat3.create(),
        y: 0
    },
}

function initModel(canvas) {
    model.width = canvas.width;
    model.height = canvas.height;
    model.halfHeight = model.height/2;
    model.halfWidth = model.width/2;

    model.field.vertices = [
        -2, -model.halfHeight,
        +2, -model.halfHeight,
        +2, model.halfHeight,
        -2, model.halfHeight,
    ]

    model.player1.vertices = [
        -model.halfWidth, -(model.racketHeight/2),
        -model.halfWidth+model.racketWidth, -(model.racketHeight/2),
        -model.halfWidth+model.racketWidth, model.racketHeight/2,
        -model.halfWidth, model.racketHeight/2,
    ]

    model.player2.vertices = [
        model.halfWidth-model.racketWidth, -(model.racketHeight/2),
        model.halfWidth, -(model.racketHeight/2),
        model.halfWidth, model.racketHeight/2,
        model.halfWidth-model.racketWidth, model.racketHeight/2,
    ]

    console.log("Model: ");
    console.log(model);
}

// we keep all local parameters for the program in a single object
var ctx = {
    shaderProgram: -1,
    aVertexPositionId: -1,
    uColorId: -1,
    uProjectionMatId: -1,
    uModelMatId: -1,
};

/**
 * Startup function to be called when the body is loaded
 */
function startup() {
    "use strict";
    var canvas = document.getElementById("myCanvas");
    initModel(canvas);
    gl = createGLContext(canvas);
    initGL();
    window.addEventListener('keyup', onKeyup, false);
    window.addEventListener('keydown', onKeydown, false);
    draw();
}

/**
 * InitGL should contain the functionality that needs to be executed only once
 */
function initGL() {
    "use strict";
    ctx.shaderProgram = loadAndCompileShaders(gl, 'VertexShader.glsl', 'FragmentShader.glsl');
    setUpAttributesAndUniforms();
    setUpBuffers();

    setupWorld();

    gl.clearColor(0.1, 0.1, 0.1, 1);
}

function setupWorld() {
    // Set up the world coordinates
    var projectionMat = mat3.create();
    mat3.fromScaling(projectionMat, [2.0/gl.drawingBufferWidth, 2.0/gl.drawingBufferHeight]);
    gl.uniformMatrix3fv(ctx.uProjectionMatId, false, projectionMat);
}

/**
 * Setup all the attribute and uniform variables
 */
function setUpAttributesAndUniforms(){
    "use strict";
    ctx.aVertexPositionId = gl.getAttribLocation(ctx.shaderProgram, "aVertexPosition");
    ctx.uColorId = gl.getUniformLocation(ctx.shaderProgram, "uColor");
    ctx.uProjectionMatId = gl.getUniformLocation(ctx.shaderProgram, "uProjectionMat");
    ctx.uModelMatId = gl.getUniformLocation(ctx.shaderProgram, "uModelMat");
}

/**
 * Setup the buffers to use. If more objects are needed this should be split in a file per object.
 */
function setUpBuffers(){
    "use strict";
    //Field
    model.field.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, model.field.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.field.vertices), gl.STATIC_DRAW);

    //Player1
    model.player1.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, model.player1.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.player1.vertices), gl.STATIC_DRAW);

    //Player2
    model.player2.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, model.player2.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.player2.vertices), gl.STATIC_DRAW);
}

/**
 * Draw the
 */
function drawField() {
    "use strict";
    gl.bindBuffer(gl.ARRAY_BUFFER, model.field.buffer);
    gl.vertexAttribPointer(ctx.aVertexPositionId, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(ctx.aVertexPositionId);

    gl.uniformMatrix3fv(ctx.uModelMatId, false, model.field.matrix);
    gl.uniform4f(ctx.uColorId, 1, 1, 1, 1);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
}

function drawPlayer1() {
    "use strict";
    gl.bindBuffer(gl.ARRAY_BUFFER, model.player1.buffer);
    gl.vertexAttribPointer(ctx.aVertexPositionId, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(ctx.aVertexPositionId);

    gl.uniformMatrix3fv(ctx.uModelMatId, false, model.player1.matrix);
    gl.uniform4f(ctx.uColorId, 0, 1, 0, 1);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
}

function drawPlayer2() {
    "use strict";
    gl.bindBuffer(gl.ARRAY_BUFFER, model.player2.buffer);
    gl.vertexAttribPointer(ctx.aVertexPositionId, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(ctx.aVertexPositionId);

    gl.uniformMatrix3fv(ctx.uModelMatId, false, model.player2.matrix);
    gl.uniform4f(ctx.uColorId, 1, 0, 0, 1);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
}

/**
 * Draw the scene.
 */
function draw() {
    "use strict";
    console.log("Drawing");
    gl.clear(gl.COLOR_BUFFER_BIT);

    drawField();
    drawPlayer1();
    drawPlayer2();
}

// Key Handling
var key = {
    _pressed: {},

    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40
};

function isDown (keyCode) {
    return key._pressed[keyCode];
}

function onKeydown(event) {
    key._pressed[event.keyCode] = true;
}

function onKeyup(event) {
    delete key._pressed[event.keyCode];
}

function oldDraw() {
    "use strict";
    console.log("Drawing");
    gl.clear(gl.COLOR_BUFFER_BIT);

    drawField();

    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.buffer);
    gl.vertexAttribPointer(ctx.aVertexPositionId, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(ctx.aVertexPositionId);

    //First
    var modelMat = mat3.create();
    mat3.fromScaling(modelMat, [model.racketWidth, model.racketHeight]);
    mat3.translate(modelMat, modelMat, [39, 0]);
    gl.uniformMatrix3fv(ctx.uModelMatId, false, modelMat);

    gl.uniform4f(ctx.uColorId, 1, 1, 1, 1);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

    //Second
    mat3.fromScaling(modelMat, [model.racketWidth, model.racketHeight]);
    mat3.translate(modelMat, modelMat, [-39, 0]);
    gl.uniformMatrix3fv(ctx.uModelMatId, false, modelMat);

    gl.uniform4f(ctx.uColorId, 0, 1, 0, 1);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
}
