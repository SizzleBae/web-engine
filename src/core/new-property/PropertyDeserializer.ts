import { PropertyVisitor } from "./PropertyVisitor";
import { Property } from "./Property";
import { PropertyStrategy } from "./PropertyStrategy";
import { SerializedObject } from "./SerializedObject";
import { PropertyUtils } from "../property/PropertyUtils";

export class PropertyDeserializer implements PropertyVisitor {

    private serializedProperty: SerializedObject = new SerializedObject();

    constructor(
        private lookup: Map<string, object> = new Map<string, object>()) {
    }

    deserialize(data: SerializedObject): Property<any> {
        this.serializedProperty = data;

        const strategy = data.construct() as PropertyStrategy<any>;
        const property = new Property(strategy);

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

    visitObjectData(property: Property<object>): void {
        const serializedObject = this.serializedProperty.data as SerializedObject;

        if (serializedObject) {
            const deserializedObject = serializedObject.construct();

            PropertyUtils.forEachPropertyIn(deserializedObject, (property, key) => {
                property.copy(new PropertyDeserializer(this.lookup).deserialize(serializedObject.data[key]));
            });

            property.set(deserializedObject);
        } else {
            property.set(undefined);
        }
    }

    visitObjectReference(property: Property<object>): void {
        if (this.serializedProperty.data.id) {
            const object = this.lookup.get(this.serializedProperty.data.id);
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
            const deserializedArray = serializedArray.map(serializedProperty => new PropertyDeserializer(this.lookup).deserialize(serializedProperty));

            property.set(deserializedArray);
        } else {
            property.set(undefined);
        }

    }

}