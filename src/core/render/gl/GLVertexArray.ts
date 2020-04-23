import { GLVertexBuffer } from "./GLVertexBuffer";
import { GLVertexBufferLayout } from "./GLVertexBufferLayout";
import { GLIndexBuffer } from "./GLIndexBuffer";
import { tsParenthesizedType } from "@babel/types";

export class GLVertexArray {

    id: WebGLVertexArrayObject;

    private vertexBuffers: GLVertexBuffer[] = [];
    private indexBuffer: GLIndexBuffer | undefined;

    constructor(private gl: WebGL2RenderingContext) {
        const arrayId = gl.createVertexArray();

        if (arrayId) {
            this.id = arrayId;
        } else {
            throw new Error(`Failed to create vertex array id!`);
        }


    }

    bind() {
        this.gl.bindVertexArray(this.id);
    }

    unbind() {
        this.gl.bindVertexArray(null);
    }

    delete() {
        this.gl.deleteVertexArray(this.id);
    }

    setIndexBuffer(indexBuffer: GLIndexBuffer) {
        this.indexBuffer = indexBuffer;

        this.bind();
        this.indexBuffer.bind();
    }

    addVertexBuffer(vertexBuffer: GLVertexBuffer) {
        this.vertexBuffers.push(vertexBuffer);

        this.bind();
        vertexBuffer.bind();

        const layout = vertexBuffer.getLayout();
        let offset = 0;
        layout.elements.forEach((element, index) => {
            this.gl.enableVertexAttribArray(index);
            this.gl.vertexAttribPointer(index, element.count, element.type, element.normalized, layout.stride, offset);
            offset += element.count * layout.getSizeOfType(element.type);
        });
    }
}