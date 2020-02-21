import { PropertyVisitor } from "./PropertyVisitor";
import { DynamicProperty } from "./DynamicProperty";
import { PropertyStrategy } from "./PropertyStrategy";
import { SerializedObject } from "./SerializedObject";
import { PropertyUtils } from "../property/PropertyUtils";

export class PropertyDeserializer implements PropertyVisitor {

    private serializedProperty: SerializedObject = new SerializedObject();

    constructor(
        private lookup: Map<string, object> = new Map<string, object>()) {
    }

    deserialize(data: SerializedObject): DynamicProperty<any> {
        this.serializedProperty = data;

        const strategy = data.construct() as PropertyStrategy<any>;
        const property = new DynamicProperty(strategy);

        property.accept(this);

        return property;
    }

    visitString(property: DynamicProperty<string>): void {
        property.set(this.serializedProperty.data);
    }

    visitNumber(property: DynamicProperty<number>): void {
        property.set(this.serializedProperty.data);
    }

    visitBoolean(property: DynamicProperty<boolean>): void {
        property.set(this.serializedProperty.data);
    }

    visitObjectData(property: DynamicProperty<object>): void {
        const serializedObject = this.serializedProperty.data as SerializedObject;

        if (serializedObject) {
            const deserializedObject = serializedObject.construct();

            PropertyUtils.forEachPropertyIn(deserializedObject, (property, key) => {
                new PropertyDeserializer(this.lookup).deserialize(serializedObject.data[key]);
                property.deserialize(serializedObject.data[key], lookup);
            });

            return deserializedObject;
        }

        return undefined;
        // const object = property.get();
        // if (object) {
        //     const serializedObject = new SerializedObject();

        //     serializedObject.destruct(object);

        //     PropertyUtils.forEachPropertyIn(object, (property, key) => {
        //         serializedObject.data[key] = new PropertySerializer(this.keepExternal, this.lookup).serialize(property);
        //     });

        //     this.serializedProperty.data = serializedObject;
        // }
    }

    visitObjectReference(property: DynamicProperty<object>): void {
        const object = property.get();

        if (object) {
            const referenceID = this.lookup.get(object);

            if (referenceID) {
                this.serializedProperty.data = referenceID;
            } else if (this.keepExternal) {
                this.serializedProperty.data = object;
            }
        }
    }

    visitArray<T>(property: DynamicProperty<DynamicProperty<T>[]>): void {
        const array = property.get();

        if (array) {
            const serializedArray: SerializedObject[] = [];

            array.forEach(subProperty => {
                serializedArray.push(new PropertySerializer(this.keepExternal, this.lookup).serialize(subProperty));
            })

            this.serializedProperty.data = serializedArray;
        }
    }

}