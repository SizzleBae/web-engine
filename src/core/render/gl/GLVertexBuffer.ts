export class GLVertexBuffer {

    private bufferId: WebGLBuffer;

    constructor(private gl: WebGL2RenderingContext, data: ArrayBuffer) {
        const bufferId = gl.createBuffer();
        if (bufferId) {
            this.bufferId = bufferId;
        } else {
            throw new Error('Failed to create GL buffer!');
        }

        this.bind();
        gl.bufferData(gl.ARRAY_BUFFER,
            data,
            gl.STATIC_DRAW);
    }

    delete() {
        this.gl.deleteBuffer(this.bufferId);
    }

    bind() {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.bufferId);
    }

    unbind() {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
    }
}