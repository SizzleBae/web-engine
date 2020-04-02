import { GLShader } from "./GLShader";

export class GLProgram {
    readonly program: WebGLProgram;

    constructor(private gl: WebGL2RenderingContext, shader: GLShader) {

        const program = this.gl.createProgram();

        if (!program) {
            throw new Error(`Failed to create shader program, gl.createProgram returned null!`);
        }

        gl.attachShader(program, shader.vertexShader);
        gl.attachShader(program, shader.fragmentShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            throw new Error(`Failed to create shader program: ${gl.getProgramInfoLog(program)}`);
        }

        this.program = program;
    }

    getAttribLocation(name: string) {
        return this.gl.getAttribLocation(this.program, name);
    }

    getUniformLocation(name: string) {
        return this.gl.getUniformLocation(this.program, name);
    }
}