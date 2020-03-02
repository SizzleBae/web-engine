import { PropertyVisitor } from "./PropertyVisitor";
import { Property } from "./Property";
import { SerializedObject } from "./SerializedObject";
import { PropertyUtils } from "./PropertyUtils";

export class PropertyDeserializer implements PropertyVisitor {

    private serializedProperty: SerializedObject = new SerializedObject();

    constructor(
        private lookup: Map<string, object> = new Map<string, object>()) {
    }

    deserialize(property: Property<any>, data: SerializedObject): Property<any> {
        this.serializedProperty = data;

        property.accept(this);

        return property;
    }

    visitString(property: Property<string>): void {
        property.set(this.serializedProperty.data);
    }

    visitNumber(property: Property<number>): void {
        property.set(this.serializedProperty.data);
    }

    visitBoolean(property: Property<boolean>): void {
        property.set(this.serializedProperty.data);
    }

    visitData<T extends object>(property: Property<T>): void {
        const serializedObject = this.serializedProperty.data as SerializedObject;

        if (serializedObject) {
            const deserializedObject = serializedObject.construct() as T;

            PropertyUtils.forEachPropertyIn(deserializedObject, (property, key) => {
                new PropertyDeserializer(this.lookup).deserialize(property, serializedObject.data[key]);
            });

            property.set(deserializedObject);
        } else {
            property.set(undefined);
        }
    }

    visitReference<T extends object>(property: Property<T>): void {
        if (this.serializedProperty.data.id) {
            const object = this.lookup.get(this.serializedProperty.data.id) as T | undefined;
            if (!object) {
                throw new Error(`Failed to deserialize object reference property - ${property}, id was found, but no object is mapped to that id in lookup table!`)
            }

            property.set(object);
        } else if (this.serializedProperty.data.object) {
            property.set(this.serializedProperty.data.object);
        } else {
            property.set(undefined);
        }
    }

    visitArray<T>(property: Property<Property<T>[]>): void {
        const serializedArray = this.serializedProperty.data as SerializedObject[];

        if (serializedArray) {
            const deserializedArray = serializedArray.map(serializedProperty => {
                const deserializedProperty = serializedProperty.construct() as Property<any>;

                return new PropertyDeserializer(this.lookup).deserialize(deserializedProperty, serializedProperty);
            });

            property.set(deserializedArray);
        } else {
            property.set(undefined);
        }

    }

}