export class GLShader {

    readonly vertexShader: WebGLShader;
    readonly fragmentShader: WebGLShader;

    constructor(private gl: WebGL2RenderingContext, vertex: () => string, fragment: () => string) {

        this.vertexShader = this.loadShader(gl.VERTEX_SHADER, vertex());
        this.fragmentShader = this.loadShader(gl.FRAGMENT_SHADER, fragment());

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