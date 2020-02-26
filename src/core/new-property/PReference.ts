import { PropertyStrategy } from "./PropertyStrategy";
import { SerializedObject } from "./SerializedObject";
import { Serializable } from "../property/Serializable";
import { PropertyVisitor } from "./PropertyVisitor";
import { Property } from "./Property";

@Serializable('core.property.ObjectReferenceStrategy')
export class PReference<T extends object> implements PropertyStrategy<T> {

    copy(property: Property<T>, source: Property<T>): void {
        property.set(source.get());
    }

    clone(property: Property<T>): Property<T> {
        return new Property<T>(new PReference<T>(), property.get());
    }

    accept(property: Property<T>, visitor: PropertyVisitor): void {
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