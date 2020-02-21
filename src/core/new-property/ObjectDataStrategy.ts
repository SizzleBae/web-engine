import { PropertyStrategy } from "./PropertyStrategy";
import { Serializable } from "../property/Serializable";
import { SerializedObject } from "./SerializedObject";
import { PropertyUtils } from "../property/PropertyUtils";
import { PropertyVisitor } from "./PropertyVisitor";
import { DynamicProperty } from "./DynamicProperty";

@Serializable('core.property.ObjectDataStrategy')
export class ObjectDataStrategy implements PropertyStrategy<object> {

    accept(visitor: PropertyVisitor, property: DynamicProperty<object>): void {
        visitor.visitObjectData(property);
    }

    serialize(value: object | undefined, lookup: Map<object, string>): SerializedObject {
        const serializedProperty = new SerializedObject();

        if (value) {
            const serializedObject = new SerializedObject();

            serializedObject.destruct(value);

            PropertyUtils.forEachPropertyIn(value, (property, key) => {
                serializedObject.data[key] = property.serialize(lookup);
            });

            serializedProperty.data = serializedObject;
        }

        return serializedProperty;
    }

    deserialize(data: SerializedObject, lookup: Map<string, object>): object | undefined {
        const serializedObject = data.data as SerializedObject;

        if (serializedObject) {
            const deserializedObject = serializedObject.construct();

            PropertyUtils.forEachPropertyIn(deserializedObject, (property, key) => {
                property.deserialize(serializedObject.data[key], lookup);
            });

            return deserializedObject;
        }

        return undefined;
    }
}