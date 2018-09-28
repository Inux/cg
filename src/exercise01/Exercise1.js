//
// Computer Graphics
//
// WebGL Exercises
//

// Register function to call after document has loaded
window.onload = startup;

// the gl object is saved globally
var gl;

// we keep all local parameters for the program in a single object
var ctx = {
    shaderProgram: -1,
    aVertexPositionId: -1,
    uColorId: -1
};

/**
 * Startup function to be called when the body is loaded
 */
function startup() {
    "use strict";
    var canvas = document.getElementById("myCanvas");
    gl = createGLContext(canvas);
    initGL();
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
    gl.clearColor(1,0,0,1);
    
    // add more necessary commands here
}

/**
 * Setup all the attribute and uniform variables
 */
function setUpAttributesAndUniforms(){
    "use strict";
    //attributes
    ctx.aVertexPositionId = gl.getAttribLocation(ctx.shaderProgram, "aVertexPosition");

    //uniform)
    ctx.uColorId = gl.getUniformLocation(ctx.shaderProgram, "uColor");
}

var rectangleObject = {
    buffer: -1
}

/**
 * Setup the buffers to use. If more objects are needed this should be split in a file per object.
 */
function setUpBuffers(){
    "use strict";
    rectangleObject.buffer = gl.createBuffer();
    var vertices = [
        -0.5,-0.5,-0.5,0.5,0.5,0.5,0.5,-0.5
    ]
    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
}

function drawRect(){
    "use strict";
    //gl.clear(gl.COLOR_BUFFER_BIT);

    var vertices = [];

    for(var i = 0; i < 4; i++) {
        var x = Math.random() * (0.000 - 1.000) + 1.000;
        var y = Math.random() * (0.000 - 1.000) + 1.000;

        vertices.push(-1*x);
        vertices.push(-1*y);

        vertices.push(-1*x);
        vertices.push(y);

        vertices.push(x);
        vertices.push(y);

        vertices.push(x);
        vertices.push(-1*y);
    }

    //rectangleObject.buffer = gl.createBuffer();
    //gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    var red = Math.random() * (0.000 - 1.000) + 1.000;
    var green = Math.random() * (0.000 - 1.000) + 1.000;
    var blue = Math.random() * (0.000 - 1.000) + 1.000;

    //set color
    gl.uniform4f(ctx.uColorId, red, green, blue, 1.0);

    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.buffer);
    gl.vertexAttribPointer(ctx.aVertexPositionId, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(ctx.aVertexPositionId);

    //gl.drawArrays(gl.LINE_LOOP, 0, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
}

/**
 * Draw the scene.
 */
function draw() {
    var interval = 1000; // ms
    var it = 0;
    var max = 100;
    var expected = Date.now() + interval;
    setTimeout(step, interval);
    function step() {
        it++;
        var dt = Date.now() - expected; // the drift (positive for overshooting)
        if (dt > interval) {
            // something really bad happened. Maybe the browser (tab) was inactive?
            // possibly special handling to avoid futile "catch up" run
        }
        drawRect();

        expected += interval;
        if(it < max) {
            setTimeout(step, Math.max(0, interval - dt)); // take into account drift
        }
    }
}
