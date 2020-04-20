export class GLIndexBuffer {

    private buffer: WebGLBuffer;

    constructor(private gl: WebGL2RenderingContext, indices: number[]) {
        const buffer = gl.createBuffer();
        if (buffer) {
            this.buffer = buffer;
        } else {
            throw new Error('Failed to create GL buffer!');
        }

        this.bind();
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
            new Int32Array(indices),
            gl.STATIC_DRAW);
    }

    bind() {
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.buffer);
    }

    unbind() {
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
    }
}