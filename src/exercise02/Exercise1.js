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
    aVertextTextureCoordId: -1,
    uSampler2DId: -1
};

// keep texture parameters in an object so we can mix textures and objects
var lennaTxt = {
    textureObj: {}
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
    gl.clearColor(1, 0, 0, 1);

    // add more necessary commands here

    loadTexture();
}

/**
 * Initialize a texture from an image
 * @param image the loaded image
 * @param textureObject WebGL Texture Object
 */
function initTexture(image, textureObject) {
    // create a new texture
    gl.bindTexture(gl.TEXTURE_2D, textureObject);

    // set parameters for the texture
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);
    // turn texture off again
    gl.bindTexture(gl.TEXTURE_2D, null);
}

/**
 * Load an image as a texture
 */
function loadTexture() {
    var image = new Image();
    // create a texture object
    lennaTxt.textureObj = gl.createTexture();
    image.onload = function () {
        initTexture(image, lennaTxt.textureObj);
        // make sure there is a redraw after the loading of the texture
        draw();
    };
    // setting the src will trigger onload
    image.src = " lena512.png";
}

/**
 * Setup all the attribute and uniform variables
 */
function setUpAttributesAndUniforms() {
    "use strict";
    //attributes
    ctx.aVertexPositionId = gl.getAttribLocation(ctx.shaderProgram, "aVertexPosition");
    ctx.aVertextTextureCoordId = gl.getAttribLocation(ctx.shaderProgram, "aVertextTextureCoord");
    ctx.uSampler2DId = gl.getUniformLocation(ctx.shaderProgram, "uSampler");
}

var rectangleObject = {
    buffer: -1
}

/**
 * Setup the buffers to use. If more objects are needed this should be split in a file per object.
 */
function setUpBuffers() {
    "use strict";
    rectangleObject.buffer = gl.createBuffer();
    var vertices = [
        -0.5, -0.5, -0.5, 0.5, 0.5, 0.5, 0.5, -0.5
    ]
    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
}

/**
 * Draw the scene.
 */
function draw() {
    "use strict";
    //gl.clear(gl.COLOR_BUFFER_BIT);

    var vertices = [
        -1.0, -1.0
        -1.0, 1.0,
        1.0, 1.0,
        1.0, -1.0
    ];
    var textureCoord = [
        0, 0,
        0, 1,
        1, 1,
        1, 0
    ];

    rectangleObject.buffer = gl.createBuffer();
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    //Amount of Elements, Type, Next value in Bytes(e.g 24 when 4 floats), Offset in Bytes
    gl.bindBuffer(gl.ARRAY_BUFFER , rectangleObject.buffer);
    gl.vertexAttribPointer(ctx.aVertexPositionId, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(ctx.aVertexPositionId);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D , lennaTxt.textureObj);
    gl.uniform1i(ctx.uSampler2DId , 0);

    gl.bindBuffer(gl.ARRAY_BUFFER , rectangleObject.textureBuffer);
    gl.vertexAttribPointer(ctx.aVertextTextureCoordId, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(ctx.aVertextTextureCoordId);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}
