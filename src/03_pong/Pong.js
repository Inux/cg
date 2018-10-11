//
// DI Computer Graphics
//
// WebGL Exercises
//

// Register function to call after document has loaded
window.onload = startup;
window.requestAnimationFrame(drawAnimated);

// the gl object is saved globally
var gl;

var model = {
    lastDraw: 0,
    width: -1,
    height: -1,
    halfWidth: -1,
    halfHeight: -1,
    racketWidth: 10,
    racketHeight: 100,
    racketHeightHalf: -1,
    maxYracket: -1,
    minYracket: -1,
    maxYball: -1,
    minYball: -1,
    maxXball: -1,
    minXball: -1,
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
        x: 0,
        y: 0
    },
    player2: {
        buffer: -1,
        vertices: [],
        matrix: mat3.create(),
        x: 0,
        y: 0
    },
    ball: {
        ballDia: 10,
        buffer: -1,
        vertices: [],
        matrix: mat3.create(),
        x: 0,
        y: 0,
    },
    logic: {
        interval: 60
    }
}

function initModel(canvas) {
    model.width = canvas.width;
    model.height = canvas.height;
    model.halfHeight = model.height/2;
    model.halfWidth = model.width/2;


    model.racketHeightHalf = model.racketHeight/2;

    model.maxYracket = model.halfHeight-model.racketHeightHalf;
    model.minYracket = -model.halfHeight+model.racketHeightHalf;

    model.maxYball = model.halfHeight-(model.ball.ballDia/2);
    model.minYball = -model.halfHeight+(model.ball.ballDia/2);
    model.maxXball = model.halfWidth-(model.ball.ballDia/2);
    model.minXball = -model.halfWidth+(model.ball.ballDia/2);

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

    model.ball.vertices = [
        -model.ball.ballDia, -model.ball.ballDia,
        +model.ball.ballDia, -model.ball.ballDia,
        +model.ball.ballDia, model.ball.ballDia,
        -model.ball.ballDia, model.ball.ballDia,
    ]

    model.ball.x = Math.floor((Math.random() * 15) + 5);
    model.ball.y = Math.floor((Math.random() * 15) + 5);

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
 * Get y from matrix
 * @param matrix
 * @returns {y}
 */
function getY(matrix) {
    return matrix[7]; //http://glmatrix.net/docs/mat3.js.html
}

/**
 * Get x from matrix
 * @param matrix
 * @returns {x}
 */
function getX(matrix) {
    return matrix[6]; //http://glmatrix.net/docs/mat3.js.html
}

/**
 * Translate Objects matrix
 * @param object
 */
function translateObject(obj) {
    mat3.translate(obj.matrix, obj.matrix, [obj.x, obj.y]);
}

/**
 * Set Max Players translation
 * @param player
 */
function setMax(player) {
    player.matrix[7] = model.maxYracket;
    player.y = 0;
}

/**
 * Set Min Players translation
 * @param player
 */
function setMin(player) {
    player.matrix[7] = model.minYracket;
    player.y = 0;
}

/**
 * Check if Player is in the field
 * @param player
 */
function checkPlayer(player) {
   if(getY(player.matrix) >= model.maxYracket) {
       setMax(player);
   }
   else if (getY(player.matrix) <= model.minYracket) {
       setMin(player);
   }
}

/**
 * Check if Ball is in the field
 * @param player
 */
function checkBall(ball) {
    if(getY(ball.matrix) >= model.maxYball) {
        ball.y *= -1;
    }
    else if (getY(ball.matrix) <= model.minYball) {
        ball.y *= -1;
    }

    if(getX(ball.matrix) >= model.maxXball) {
        ball.x *= -1;
    }
    else if (getX(ball.matrix) <= model.minXball) {
        ball.x *= -1;
    }
}

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

    //Ball
    model.ball.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, model.ball.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.ball.vertices), gl.STATIC_DRAW);
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

function computePlayer1() {
    if(isDown(key.UP) && !isDown(key.DOWN)) {
        model.player1.y++;
        translateObject(model.player1);
        checkPlayer(model.player1);
    } else if(isDown(key.DOWN) && !isDown(key.UP)) {
        model.player1.y--;
        translateObject(model.player1);
        checkPlayer(model.player1);
    }
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

function drawBall() {
    "use strict";
    gl.bindBuffer(gl.ARRAY_BUFFER, model.ball.buffer);
    gl.vertexAttribPointer(ctx.aVertexPositionId, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(ctx.aVertexPositionId);

    gl.uniformMatrix3fv(ctx.uModelMatId, false, model.ball.matrix);
    gl.uniform4f(ctx.uColorId, 0, 0, 1, 1);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
}

function computeBall() {
    checkBall(model.ball);
    translateObject(model.ball);
}

/**
 * Draw the scene.
 */
function draw() {
    "use strict";
    gl.clear(gl.COLOR_BUFFER_BIT);

    drawField();
    drawPlayer1();
    drawPlayer2();
    drawBall();
}

function drawAnimated(timeStamp) {
    if(model.lastDraw == 0 || (timeStamp - model.lastDraw) > model.logic.interval) {
        model.lastDraw = timeStamp;

        computeBall();
        computePlayer1();

        draw();
        // request the next frame
    }

    window.requestAnimationFrame(drawAnimated);
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
    key._pressed[event.keyCode] = false;
}


