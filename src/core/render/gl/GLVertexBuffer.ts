import { GLVertexBufferLayout } from "./GLVertexBufferLayout";

export class GLVertexBuffer {

    private id: WebGLBuffer;

    constructor(private gl: WebGL2RenderingContext, private layout: GLVertexBufferLayout, data?: ArrayBuffer, size?: number, private readonly dynamic: boolean = false) {
        const bufferId = gl.createBuffer();
        if (bufferId) {
            this.id = bufferId;
        } else {
            throw new Error('Failed to create GL buffer!');
        }

        this.bind();

        if (dynamic) {
            if (size) {
                gl.bufferData(gl.ARRAY_BUFFER, size, gl.DYNAMIC_DRAW);
            } else {
                gl.bufferData(gl.ARRAY_BUFFER, data ? data : null, gl.DYNAMIC_DRAW);
            }
        } else {
            if (data) {
                gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
            } else {
                throw new Error(`Failed to create vertex buffer: Can't construct static vertex buffer with no data`);
            }
        }
    }

    delete() {
        this.gl.deleteBuffer(this.id);
    }

    bind() {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.id);
    }

    unbind() {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
    }

    getLayout(): GLVertexBufferLayout {
        return this.layout;
    }

    setData(data: ArrayBuffer) {
        if (this.dynamic) {
            this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, data);
        } else {
            throw new Error(`Failed to set data to vertex buffer: Vertex buffer is not dynamic`)
        }
    }
}