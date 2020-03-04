export class Shader {

    readonly vertexShader: WebGLShader;
    readonly fragmentShader: WebGLShader;
    readonly program: WebGLProgram;

    constructor(private gl: WebGL2RenderingContext, vertexShader: string, fragmentShader: string) {
        this.vertexShader = this.loadShader(gl.VERTEX_SHADER, vertexShader);
        this.fragmentShader = this.loadShader(gl.FRAGMENT_SHADER, fragmentShader);

        const program = gl.createProgram();

        if (!program) {
            throw new Error(`Failed to create shader program, gl.createProgram returned null!`);
        }

        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            throw new Error(`Failed to create shader program: ${gl.getProgramInfoLog(program)}`);
        }

        this.program = program;
    }

    private loadShader(type: number, source: string): WebGLShader {
        const shader = this.gl.createShader(type);

        if (!shader) {
            throw new Error(`Failed to create shader, gl.createShader returned null!`);
        }

        this.gl.shaderSource(shader, source);

        this.gl.compileShader(shader);

        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            this.gl.deleteShader(shader);
            throw new Error(`Failed to create shader, error occured while compiling shader: ${this.gl.getShaderInfoLog(shader)}

                Source:
                ${source}`);
        }

        return shader;
    }
}