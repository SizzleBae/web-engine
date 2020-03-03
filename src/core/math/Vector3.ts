import { Serializable } from "../property/Serializable";
import { PNumber } from "../property/PNumber";

@Serializable('core.math.Vector3')
export class Vector3 {
    readonly x = new PNumber(0);
    readonly y = new PNumber(0);
    readonly z = new PNumber(0);

}