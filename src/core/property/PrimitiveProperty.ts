import { DynamicProperty, SerializedProperty } from "./Property";
import { Serializable, META_SERIALIZABLE_ID_KEY } from "./Serializable";
import { PropertyVisitor } from "./PropertyVisitor";

export type primitive = string | number | boolean;

@Serializable('core.PrimitiveProperty')
export class PrimitiveProperty<T extends primitive> extends DynamicProperty<T> {

    public accept(visitor: PropertyVisitor): void {
        visitor.visitPrimitive(this);
    }

    public copyFrom(source: DynamicProperty<T>): void {
        this.value = source.get();
    }

    public clone(): DynamicProperty<T> {
        return new PrimitiveProperty<T>(this.value, this.readonly);
    }

    public serialize(lookup: Map<object, string>): SerializedProperty {
        return new SerializedProperty(Reflect.get(this.constructor, META_SERIALIZABLE_ID_KEY), this.value);
    }

    public deserialize(lookup: Map<string, object>, property: SerializedProperty): void {
        this.value = property.data;
    }

}