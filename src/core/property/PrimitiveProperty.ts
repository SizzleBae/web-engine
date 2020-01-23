import { DynamicProperty } from "./Property";
import { Serializable, META_SERIALIZABLE_ID_KEY } from "./Serializable";

export type Primitive = string | number | boolean;

@Serializable('core.PrimitiveProperty')
export class PrimitiveProperty<T extends Primitive> extends DynamicProperty<T> {

    public toJSON(): any {
        const json = {} as any;
        json['constructorID'] = Reflect.get(this.constructor, META_SERIALIZABLE_ID_KEY);

        if (this.value === null) {
            return json
        }

        const primitive = this.value;
        json['primitive'] = primitive;

        return json;

    }
    public fromJSON(json: any): void {
        if (json['primitive'] === undefined) {
            throw new Error(`Failed to set primitive property ${this} from JSON, missing primitive value: ${json}`);
        }

        if (json['primitive'] !== null && this.value !== null && typeof json['primitive'] !== typeof this.value) {
            throw new Error(`Failed to set primitive property ${this} from JSON, invalid primitive value: ${json}`);
        }

        this.value = json['primitive'];

    }
}