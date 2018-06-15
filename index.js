"use strict";

var sha256 = require('./sha256.js');

module.exports = {
  getGpuHash: function () {
    var canvas = document.createElement('canvas');
    canvas.height = 128;
    canvas.width = 256;

    var context = canvas.getContext('webgl2') || canvas.getContext('experimental-webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl') || canvas.getContext('moz-webgl');
    var buffer = context.createBuffer();

    context.bindBuffer(context.ARRAY_BUFFER, buffer);
    context.bufferData(context.ARRAY_BUFFER, new Float32Array([-.2, -.9, 0, .4, -.26, 0, 0, .7321, 0]), context.STATIC_DRAW);

    var program = context.createProgram();
    var vertexShader = context.createShader(context.VERTEX_SHADER);
    var fragmentShader = context.createShader(context.FRAGMENT_SHADER);

    context.shaderSource(vertexShader, 'attribute vec2 attrVertex;varying vec2 varyinTexCoordinate;uniform vec2 uniformOffset;void main(){varyinTexCoordinate=attrVertex+uniformOffset;gl_Position=vec4(attrVertex,0,1);}');
    context.compileShader(vertexShader);

    context.shaderSource(fragmentShader, 'precision mediump float;varying vec2 varyinTexCoordinate;void main() {gl_FragColor=vec4(varyinTexCoordinate,0,1);}');
    context.compileShader(fragmentShader);

    context.attachShader(program, vertexShader);
    context.attachShader(program, fragmentShader);

    context.linkProgram(program);
    context.useProgram(program);

    program.vertexPosAttrib = context.getAttribLocation(program, 'attrVertex');
    program.offsetUniform = context.getUniformLocation(program, 'uniformOffset');

    context.enableVertexAttribArray(program.vertexPosArray);
    context.vertexAttribPointer(program.vertexPosAttrib, 3, context.FLOAT, false, 0, 0);
    context.uniform2f(program.offsetUniform, 1, 1);
    context.drawArrays(context.TRIANGLE_STRIP, 0, 3);

    var pixels = new Uint8Array(131072); // 256 * 128 * 4
    context.readPixels(0, 0, 256, 128, context.RGBA, context.UNSIGNED_BYTE, pixels);

    return sha256(JSON.stringify(pixels).replace(/,?"[0-9]+":/g, ''))
  },

  getGpuRating: function () {
    return 'Work in progress... 😁'
  }
};
