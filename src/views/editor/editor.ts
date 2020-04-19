import { Matrix4 } from "../../core/math/Matrix4";
import { GLBasicMaterial } from "../../core/render/material/GLBasicMaterial";
import { Vector3 } from "../../core/math/Vector3";

export class Editor {

    initialize() {
        const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;

        // Initialize the GL context
        const gl = canvas.getContext("webgl2");

        // Only continue if WebGL is available and working
        if (gl === null) {
            alert("Unable to initialize WebGL. Your browser or machine may not support it.");
            return;
        }

        const material = new GLBasicMaterial(gl);

        // Create a buffer for the square's positions.
        const positionBuffer = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        // Now create an array of positions for the square.
        const positions = [
            -1.0, 2.0,
            1.0, 1.0,
            -1.0, -1.0,
            1.0, -1.0,
        ];

        gl.bufferData(gl.ARRAY_BUFFER,
            new Float32Array(positions),
            gl.STATIC_DRAW);

        gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
        gl.clearDepth(1.0);                 // Clear everything
        gl.enable(gl.DEPTH_TEST);           // Enable depth testing
        gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

        // Clear the canvas before we start drawing on it.
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        const fieldOfView = 45 * Math.PI / 180;   // in radians
        const aspect = canvas.width / canvas.height;
        const zNear = 0.1;
        const zFar = 100.0;

        // Tell WebGL how to pull out the positions from the position
        // buffer into the vertexPosition attribute.
        {
            const numComponents = 2;  // pull out 2 values per iteration
            const type = gl.FLOAT;    // the data in the buffer is 32bit floats
            const normalize = false;  // don't normalize
            const stride = 0;         // how many bytes to get from one set of values to the next
            // 0 = use type and numComponents above
            const offset = 0;         // how many bytes inside the buffer to start from
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            gl.vertexAttribPointer(
                material.aVertexPosition,
                numComponents,
                type,
                normalize,
                stride,
                offset);
            gl.enableVertexAttribArray(material.aVertexPosition);
        }

        material.use();

        Matrix4.perspective(material.projectionMatrix.get(), fieldOfView, aspect, zNear, zFar);

        Matrix4.translate(material.modelViewMatrix.get(), material.modelViewMatrix.get(), new Vector3(0, 0, -6));

        console.log(material);

        {
            const offset = 0;
            const vertexCount = 4;
            gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
        }
    }

    render() {

    }

}

window.onload = () => new Editor().initialize();