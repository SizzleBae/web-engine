import { PropertyStrategy } from "./PropertyStrategy";
import { Serializable } from "../property/Serializable";
import { SerializedObject } from "./SerializedObject";
import { DynamicProperty } from "./DynamicProperty";

@Serializable('core.property.StringStrategy')
export class ArrayStrategy<T> implements PropertyStrategy<DynamicProperty<T>[]> {
    serialize(value: DynamicProperty<T>[] | undefined, lookup: Map<object, string>): SerializedObject {
        const serializedProperty = new SerializedObject();

        if (value) {
            const serializedArray: SerializedObject[] = [];

            value.forEach(subProperty => {
                serializedArray.push(subProperty.serialize(lookup));
            })

            serializedProperty.data = serializedArray;
        }

        return serializedProperty;
    }

    deserialize(data: SerializedObject, lookup: Map<string, object>): DynamicProperty<T>[] | undefined {
        const serializedArray = data.data as SerializedObject[];

        if (serializedArray) {
            const deserializedArray: DynamicProperty<T>[] = [];

            serializedArray.forEach(serializedSubProperty => {
                const deserializedSubStrategy = serializedSubProperty.construct() as PropertyStrategy<T>;
                const deserializedSubProperty = new DynamicProperty<T>(deserializedSubStrategy);

                deserializedSubProperty.deserialize(serializedSubProperty, lookup);

                deserializedArray.push(deserializedSubProperty);
            });

            return deserializedArray;
        }

        return undefined;
    }


}