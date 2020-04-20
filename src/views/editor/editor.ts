import WebGLDebugUtils from "../../utils/webgl-debug"
import { Matrix4 } from "../../core/math/Matrix4";
import { GLBasicMaterial } from "../../core/render/material/GLBasicMaterial";
import { Vector3 } from "../../core/math/Vector3";
import { GLVertexBuffer } from "../../core/render/gl/GLVertexBuffer";
import { GLIndexBuffer } from "../../core/render/gl/GLIndexBuffer";
import { GLVertexBufferLayout } from "../../core/render/gl/GLVertexBufferLayout";
import { GLVertexArray } from "../../core/render/gl/GLVertexArray";

export class Editor {

    initialize() {
        const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;

        // Initialize the GL context
        let gl = canvas.getContext("webgl2");
        // Only continue if WebGL is available and working
        if (gl === null) {
            alert("Unable to initialize WebGL. Your browser or machine may not support it.");
            return;
        }

        // Setup webgl debugging
        const webglDebugUtils = WebGLDebugUtils();
        gl = webglDebugUtils.makeDebugContext(gl, (err, funcName, args) => {
            throw new Error(`${webglDebugUtils.glEnumToString(err)} was caused by call to: ${funcName}`);
        });

        const material = new GLBasicMaterial(gl);

        // Now create an array of positions for the square.
        const positions = [
            -1.0, -1.0,
            1.0, -1.0,
            1.0, 1.0,
            -1.0, 1.0,
        ];

        // Create a buffer for the square's positions.
        const vertices = new GLVertexBuffer(gl, new Float32Array(positions));

        const indices = [
            0, 1, 2,
            2, 3, 0
        ];

        const indexBuffer = new GLIndexBuffer(gl, indices);

        const vertexLayout = new GLVertexBufferLayout(gl);
        vertexLayout.pushFloat(2);

        const vertexArray = new GLVertexArray(gl);
        vertexArray.addBuffer(vertices, vertexLayout);

        gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
        gl.clearDepth(1.0);                 // Clear everything
        gl.enable(gl.DEPTH_TEST);           // Enable depth testing
        gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

        // Clear the canvas before we start drawing on it.
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        material.use();

        const fieldOfView = 45 * Math.PI / 180;   // in radians
        const aspect = canvas.width / canvas.height;
        const zNear = 0.1;
        const zFar = 100.0;
        Matrix4.perspective(material.projectionMatrix.get(), fieldOfView, aspect, zNear, zFar);

        Matrix4.translate(material.modelViewMatrix.get(), material.modelViewMatrix.get(), new Vector3(0, 0, -6));

        console.log(material);

        {
            vertexArray.bind();
            indexBuffer.bind();

            const offset = 0;
            gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_INT, offset);
        }
    }

    render() {

    }

}

window.onload = () => new Editor().initialize();