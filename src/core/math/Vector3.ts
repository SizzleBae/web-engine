import { Serializable } from "../serialize/Serializable";
import { PType } from "../property/DynamicProperty";
import { ArrayProperty } from "../property/ArrayProperty";

@Serializable('core.math.Vector3')
export class Vector3 {
    private readonly m = new ArrayProperty(PType.Number, [0, 0, 0]);

    constructor(x?: number, y?: number, z?: number) {
        this.x = x ? x : 0;
        this.y = y ? y : 0;
        this.z = z ? z : 0;
    }

    get x() {
        return this.get()[0];
    }

    set x(value: number) {
        this.get()[0] = value;
    }

    get y() {
        return this.get()[1];
    }

    set y(value: number) {
        this.get()[1] = value;
    }

    get z() {
        return this.get()[2];
    }

    set z(value: number) {
        this.get()[2] = value;
    }

    [Symbol.iterator](): Iterator<number> {
        return this.get()[Symbol.iterator]();
    }

    clone(): Vector3 {
        return new Vector3(this.x, this.y, this.z);
    }

    get(): number[] {
        return (this.m.get() as number[]);
    }

}