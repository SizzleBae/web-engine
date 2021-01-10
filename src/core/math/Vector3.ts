import { Serializable } from "../serialize/Serializable";
import {ArrayProperty} from "../property-new/ArrayProperty";
import {PNumber} from "../property-new/strategy/NumberStrategy";

@Serializable('core.math.Vector3')
export class Vector3 {
    private readonly m = new ArrayProperty(PNumber(), [0, 0, 0]);

    constructor(x?: number, y?: number, z?: number) {
        this.x = x ? x : 0;
        this.y = y ? y : 0;
        this.z = z ? z : 0;
    }

    get x() {
        return this.m.get(0);
    }

    set x(value: number) {
        this.m.set(0, value);
    }

    get y() {
        return this.m.get(1);
    }

    set y(value: number) {
        this.m.set(1, value);
    }

    get z() {
        return this.m.get(2);
    }

    set z(value: number) {
        this.m.set(2, value);
    }

    [Symbol.iterator]() {
        return this.m[Symbol.iterator];
    }

    clone(): Vector3 {
        return new Vector3(this.x, this.y, this.z);
    }
}