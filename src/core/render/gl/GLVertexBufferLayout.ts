export type GLVertexBufferElement = {
    type: number,
    count: number,
    normalized: boolean
}

export class GLVertexBufferLayout {
    elements: GLVertexBufferElement[] = [];
    stride: number = 0;

    constructor(private gl: WebGL2RenderingContext) {

    }

    pushFloat(count: number) {
        this.push(this.gl.FLOAT, count, false);
    }

    pushUnsignedInt(count: number) {
        this.push(this.gl.UNSIGNED_INT, count, false);
    }

    pushUnsignedByte(count: number) {
        this.push(this.gl.UNSIGNED_BYTE, count, true);
    }

    push(type: number, count: number, normalized: boolean) {
        this.elements.push({
            type, count, normalized
        })

        this.stride += this.getSizeOfType(type) * count;
    }

    getSizeOfType(type: number): number {
        switch (type) {
            case this.gl.FLOAT: return 4;
            case this.gl.UNSIGNED_INT: return 4;
            case this.gl.UNSIGNED_BYTE: return 1;
            default:
                throw new Error(`Failed to get size of unrecognized gl type: ${type}`);
        }
    }
}

