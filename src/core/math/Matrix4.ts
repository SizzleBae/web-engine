import { ArrayProperty } from "../property/ArrayProperty";
import { PType } from "../property/DynamicProperty";
import { Serializable } from "../serialize/Serializable";

@Serializable('core.math.Matrix4')
export class Matrix4 {
    public m = new ArrayProperty<number>(PType.Number, [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1,
    ]);
}