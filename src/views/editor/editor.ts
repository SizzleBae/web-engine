import { GLShader } from "../../core/render/gl/GLShader";
import { GLProgram } from "../../core/render/gl/GLProgram";
import { Matrix4 } from "../../core/math/Matrix4";

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

        const vsSource = `
            attribute vec4 aVertexPosition;

            uniform mat4 uModelViewMatrix;
            uniform mat4 uProjectionMatrix;

            void main() {
            gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
            }
        `;

        const fsSource = `
            void main() {
            gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
            }
        `;

        const shader = new GLShader(gl, vsSource, fsSource);

        const program = new GLProgram(gl, shader);

        const mat4 = new Matrix4();

        // Set clear color to black, fully opaque
        gl.clearColor(0.0, 0.0, 1.0, 1.0);
        // Clear the color buffer with specified clear color
        gl.clear(gl.COLOR_BUFFER_BIT);
    }

    render() {

    }

}

window.onload = () => new Editor().initialize();