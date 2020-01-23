import { DynamicProperty } from "./Property";
import { SerializeUtils } from "./SerializeUtils";
import { Serializable } from "./Serializable";

export type Primitive = string | number | boolean;

@Serializable('core.PrimitiveProperty')
export class PrimitiveProperty<T extends Primitive> extends DynamicProperty<T> {

    public toJSON(): any {
        return this.value;
    }
    public fromJSON(json: any): void {
        this.value = json.value;
    }
}