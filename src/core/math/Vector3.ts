import { Serializable } from "../serialize/Serializable";
import { Property } from "../property/Property";
import { PType } from "../property/DynamicProperty";

@Serializable('core.math.Vector3')
export class Vector3 {
    readonly x = new Property(PType.Number, 0);
    readonly y = new Property(PType.Number, 0);
    readonly z = new Property(PType.Number, 0);

}