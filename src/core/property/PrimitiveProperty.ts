import { DynamicProperty, SerializedProperty } from "./Property";
import { Serializable, META_SERIALIZABLE_ID_KEY } from "./Serializable";

export type primitive = string | number | boolean;

@Serializable('core.PrimitiveProperty')
export class PrimitiveProperty<T extends primitive> extends DynamicProperty<T> {

    public serialize(outJSON: any, lookup: Map<object, string>): SerializedProperty {
        return new SerializedProperty(Reflect.get(this.constructor, META_SERIALIZABLE_ID_KEY), this.value);
    }

    public deserialize(inJSON: any, lookup: Map<string, object>, property: SerializedProperty): void {
        this.value = property.data;
    }

}