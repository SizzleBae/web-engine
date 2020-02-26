import { PropertyStrategy } from "./PropertyStrategy";
import { Serializable } from "../property/Serializable";
import { SerializedObject } from "./SerializedObject";
import { PropertyUtils } from "../property/PropertyUtils";
import { PropertyVisitor } from "./PropertyVisitor";
import { Property } from "./Property";

@Serializable('core.property.ObjectDataStrategy')
export class PData<T extends object> implements PropertyStrategy<T> {

    copy(property: Property<T>, source: Property<T>): void {
        //TODO: Clone??
        property.set(source.get());
    }

    clone(property: Property<T>): Property<T> {
        //TODO: Clone??
        return new Property<T>(new PData<T>(), property.get());
    }

    accept(property: Property<T>, visitor: PropertyVisitor): void {
        visitor.visitObjectData(property);
    }

    // serialize(value: object | undefined, lookup: Map<object, string>): SerializedObject {
    //     const serializedProperty = new SerializedObject();

    //     if (value) {
    //         const serializedObject = new SerializedObject();

    //         serializedObject.destruct(value);

    //         PropertyUtils.forEachPropertyIn(value, (property, key) => {
    //             serializedObject.data[key] = property.serialize(lookup);
    //         });

    //         serializedProperty.data = serializedObject;
    //     }

    //     return serializedProperty;
    // }

    // deserialize(data: SerializedObject, lookup: Map<string, object>): object | undefined {
    //     const serializedObject = data.data as SerializedObject;

    //     if (serializedObject) {
    //         const deserializedObject = serializedObject.construct();

    //         PropertyUtils.forEachPropertyIn(deserializedObject, (property, key) => {
    //             property.deserialize(serializedObject.data[key], lookup);
    //         });

    //         return deserializedObject;
    //     }

    //     return undefined;
    // }
}

export type Data<T extends object> = PData<T>;