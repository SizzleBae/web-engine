import { PropertyStrategy } from "./PropertyStrategy";
import { SerializedObject } from "./SerializedObject";
import { Serializable } from "../property/Serializable";
import { PropertyVisitor } from "./PropertyVisitor";
import { DynamicProperty } from "./DynamicProperty";

@Serializable('core.property.ObjectReferenceStrategy')
export class ObjectReferenceStrategy<T extends object> implements PropertyStrategy<T> {

    copy(property: DynamicProperty<T>, source: DynamicProperty<T>): void {
        property.set(source.get());
    }

    clone(property: DynamicProperty<T>): DynamicProperty<T> {
        return new DynamicProperty<T>(new ObjectReferenceStrategy<T>(), property.get());
    }

    accept(property: DynamicProperty<T>, visitor: PropertyVisitor): void {
        visitor.visitObjectReference(property);
    }

    // serialize(value: object | undefined, lookup: Map<object, string>): SerializedObject {
    //     const serializedProperty = new SerializedObject();

    //     if (value) {
    //         serializedProperty.data = lookup.get(value);
    //     }

    //     return serializedProperty;
    // }

    // deserialize(serializedProperty: SerializedObject, lookup: Map<string, object>): object | undefined {
    //     if (serializedProperty.data) {
    //         return lookup.get(serializedProperty.data);
    //     }

    //     return undefined;
    // }

}