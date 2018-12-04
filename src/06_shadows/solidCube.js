/**
 * Created by toko on 13.05.17.
 */

/**
 *
 * Define a solid cube with methods for drawing it.
 *
 * @param gl
 * @param backColor
 * @param frontColor
 * @param rightColor
 * @param leftColor
 * @param topColor
 * @param bottomColor
 * @returns object with draw method
 * @constructor
 */
function SolidCube(gl, backColor, frontColor, rightColor, leftColor, topColor, bottomColor) {
    function defineVertices(gl) {
        // define the vertices of the cube
        var vertices = [
            // back
            -0.5,-0.5,-0.5, //v0
            0.5,-0.5,-0.5,  //v1
            -0.5,0.5,-0.5,  //v2
            0.5,0.5,-0.5,   //v3

            // left
            -0.5,-0.5,-0.5, //v4
            -0.5,0.5,-0.5,  //v5
            -0.5,-0.5,0.5,  //v6
            -0.5,0.5,0.5,   //v7

            // front
            -0.5,-0.5,0.5,  //v8
            -0.5,0.5,0.5,   //v9
            0.5,-0.5,0.5,   //v10
            0.5,0.5,0.5,    //v11

            // right
            0.5,-0.5,-0.5,  //v12
            0.5,0.5,-0.5,   //v13
            0.5,-0.5,0.5,   //v14
            0.5,0.5,0.5,    //v15

            // top
            0.5,0.5,-0.5,   //v16
            -0.5,0.5,-0.5,  //v17
            0.5,0.5,0.5,    //v18
            -0.5,0.5,0.5,   //v19

            // bottom
            -0.5,-0.5,-0.5, //v20
            0.5,-0.5,-0.5,  //v21
            -0.5,-0.5,0.5,  //v22
            0.5,-0.5,0.5    //v23


        ];
        var buffer  = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        return buffer;
    }

    function defineSides(gl) {
        // define the edges for the cube, there are 12 edges in a cube
        var vertexIndices = [
            //back
            0,1,2,
            1,2,3,

            //left
            4,5,6,
            5,6,7,

            //front
            8,9,10,
            9,10,11,

            //right
            12,13,14,
            13,14,15,

            // top
            16,17,18,
            17,18,19,

            //bottom
            20,21,22,
            21,22,23
        ];
        var buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertexIndices), gl.STATIC_DRAW);

        return buffer;
    }

    function defineTexture(gl) {
        var texture = [
            1,0,
            0,0,
            1,1,
            0,1,

            0,0,
            0,1,
            1,0,
            1,1,

            0,0,
            0,1,
            1,0,
            1,1,

            0,0,
            0,1,
            1,0,
            1,1,

            0,0,
            0,1,
            1,0,
            1,1,

            0,0,
            0,1,
            1,0,
            1,1
        ];

        var buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texture), gl.STATIC_DRAW);

        return buffer;
    }

    function defineColors(gl, backColor, frontColor, rightColor, leftColor, topColor, bottomColor) {
        // make 4 entries, one for each vertex
        var backSide = backColor.concat(backColor, backColor, backColor);
        var frontSide = frontColor.concat(frontColor, frontColor, frontColor);
        var rightSide = rightColor.concat(rightColor, rightColor, rightColor);
        var leftSide = leftColor.concat(leftColor, leftColor, leftColor);
        var topSide = topColor.concat(topColor, topColor, topColor);
        var bottomSide = bottomColor.concat(bottomColor, bottomColor, bottomColor);

        var allSides = backSide.concat(frontSide, rightSide, leftSide, topSide, bottomSide);

        var buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(allSides), gl.STATIC_DRAW);
        return buffer;
    }

    function defineNormals(gl) {
        var backNormal = [0.0, 0.0, -1.0];
        var frontNormal = [0.0, 0.0, 1.0];
        var rightNormal = [1.0, 0.0, 0.0];
        var leftNormal = [-1.0, 0.0, 0.0];
        var topNormal = [0.0, 1.0, 0.0];
        var bottomNormal = [0.0, -1.0, 0.0];

        // make 4 entries, one for each vertex
        var backSideNormal    = backNormal.concat(backNormal, backNormal, backNormal);
        var frontSideNormal   = frontNormal.concat(frontNormal, frontNormal, frontNormal);
        var rightSideNormal   = rightNormal.concat(rightNormal, rightNormal, rightNormal);
        var leftSideNormal    = leftNormal.concat(leftNormal, leftNormal, leftNormal);
        var topSideNormal     = topNormal.concat(topNormal, topNormal, topNormal);
        var bottomSideNormal  = bottomNormal.concat(bottomNormal, bottomNormal, bottomNormal);

        var allSidesNormal = backSideNormal.concat(frontSideNormal, rightSideNormal, leftSideNormal, topSideNormal, bottomSideNormal);

        var buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(allSidesNormal), gl.STATIC_DRAW);
        return buffer;
    }




    return {
        bufferVertices: defineVertices(gl),
        bufferSides: defineSides(gl),
        bufferColors: defineColors(gl, backColor, frontColor, rightColor, leftColor, topColor, bottomColor),
        bufferNormals: defineNormals(gl),
        bufferTextures: defineTexture(gl),

        draw: function(gl, aVertexPositionId, aVertexColorId, aVertexNormalId, aVertexTextureCoordId, textureObj) {
            // ositionp
            gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferVertices);
            gl.vertexAttribPointer(aVertexPositionId, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(aVertexPositionId);

            // color buffer
            //gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferColors);
            //gl.vertexAttribPointer(aVertexColorId, 3, gl.FLOAT, false, 0, 0);
            //gl.enableVertexAttribArray(aVertexColorId);

            // normal
            gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferNormals);
            gl.vertexAttribPointer(aVertexNormalId, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(aVertexNormalId);

            // textures
            gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferTextures);
            gl.enableVertexAttribArray(aVertexTextureCoordId);
            gl.vertexAttribPointer(aVertexTextureCoordId, 2, gl.FLOAT, false, 0, 0);
            gl.bindTexture(gl.TEXTURE_2D, textureObj);
            gl.activeTexture(gl.TEXTURE0);

            // bind the element array
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufferSides);
            gl.drawElements(gl.TRIANGLES, 36 ,gl.UNSIGNED_SHORT, 0);

        }
    }
}



