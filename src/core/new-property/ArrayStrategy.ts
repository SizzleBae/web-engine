import { PropertyStrategy } from "./PropertyStrategy";
import { Serializable } from "../property/Serializable";
import { SerializedObject } from "./SerializedObject";
import { DynamicProperty } from "./DynamicProperty";
import { PropertyVisitor } from "./PropertyVisitor";

@Serializable('core.property.ArrayStrategy')
export class ArrayStrategy<T> implements PropertyStrategy<DynamicProperty<T>[]> {

    clone(property: DynamicProperty<DynamicProperty<T>[]>): DynamicProperty<DynamicProperty<T>[]> {
        return new DynamicProperty(new ArrayStrategy<T>(), undefined).copy(property);
    }

    copy(property: DynamicProperty<DynamicProperty<T>[]>, source: DynamicProperty<DynamicProperty<T>[]>): void {
        const sourceArray = source.get();
        if (sourceArray) {
            const clonedArray = sourceArray.map(sourceProperty => sourceProperty.clone());
            property.set(clonedArray);
        }
    }

    accept(property: DynamicProperty<DynamicProperty<T>[]>, visitor: PropertyVisitor): void {
        visitor.visitArray(property);
    }

    // serialize(value: DynamicProperty<T>[] | undefined, lookup: Map<object, string>): SerializedObject {
    //     const serializedProperty = new SerializedObject();

    //     if (value) {
    //         const serializedArray: SerializedObject[] = [];

    //         value.forEach(subProperty => {
    //             serializedArray.push(subProperty.serialize(lookup));
    //         })

    //         serializedProperty.data = serializedArray;
    //     }

    //     return serializedProperty;
    // }

    // deserialize(data: SerializedObject, lookup: Map<string, object>): DynamicProperty<T>[] | undefined {
    //     const serializedArray = data.data as SerializedObject[];

    //     if (serializedArray) {
    //         const deserializedArray: DynamicProperty<T>[] = [];

    //         serializedArray.forEach(serializedSubProperty => {
    //             const deserializedSubStrategy = serializedSubProperty.construct() as PropertyStrategy<T>;
    //             const deserializedSubProperty = new DynamicProperty<T>(deserializedSubStrategy);

    //             deserializedSubProperty.deserialize(serializedSubProperty, lookup);

    //             deserializedArray.push(deserializedSubProperty);
    //         });

    //         return deserializedArray;
    //     }

    //     return undefined;
    // }


}