export class GLIndexBuffer {

    private id: WebGLBuffer;

    constructor(private gl: WebGL2RenderingContext, indices: number[]) {
        const buffer = gl.createBuffer();
        if (buffer) {
            this.id = buffer;
        } else {
            throw new Error('Failed to create GL buffer!');
        }

        this.bind();
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
            new Int32Array(indices),
            gl.STATIC_DRAW);
    }

    delete() {
        this.gl.deleteBuffer(this.id);
    }

    bind() {
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.id);
    }

    unbind() {
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
    }
}