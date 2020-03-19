import { ArrayProperty } from "../property/ArrayProperty";
import { PType } from "../property/DynamicProperty";

export class Matrix4 {
    public m = new ArrayProperty<number>(PType.Number, [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1,
    ]);
}