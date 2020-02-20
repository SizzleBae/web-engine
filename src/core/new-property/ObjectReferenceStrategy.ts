import { PropertyStrategy } from "./PropertyStrategy";
import { SerializedObject } from "./SerializedObject";
import { Serializable } from "../property/Serializable";

@Serializable('core.property.ObjectReferenceStrategy')
export class ObjectReferenceStrategy implements PropertyStrategy<object> {

    serialize(value: object | undefined, lookup: Map<object, string>): SerializedObject {
        const serializedProperty = new SerializedObject();

        if (value) {
            serializedProperty.data = lookup.get(value);
        }

        return serializedProperty;
    }

    deserialize(serializedProperty: SerializedObject, lookup: Map<string, object>): object | undefined {
        if (serializedProperty.data) {
            return lookup.get(serializedProperty.data);
        }

        return undefined;
    }

}