import { GLVertexBuffer } from "./GLVertexBuffer";
import { GLVertexBufferLayout } from "./GLVertexBufferLayout";

export class GLVertexArray {

    arrayId: WebGLVertexArrayObject;

    constructor(private gl: WebGL2RenderingContext) {
        const arrayId = gl.createVertexArray();

        if (arrayId) {
            this.arrayId = arrayId;
        } else {
            throw new Error(`Failed to create vertex array id!`);
        }


    }

    bind() {
        this.gl.bindVertexArray(this.arrayId);
    }

    unbind() {
        this.gl.bindVertexArray(null);
    }

    delete() {
        this.gl.deleteVertexArray(this.arrayId);
    }

    addBuffer(vertexBuffer: GLVertexBuffer, layout: GLVertexBufferLayout) {
        this.bind();
        vertexBuffer.bind();

        let offset = 0;
        layout.elements.forEach((element, index) => {
            this.gl.enableVertexAttribArray(index);
            this.gl.vertexAttribPointer(index, element.count, element.type, element.normalized, layout.stride, offset);
            offset += element.count * layout.getSizeOfType(element.type);
        });
    }
}