import { PropertyVisitor } from "./PropertyVisitor";
import { primitive, PrimitiveProperty } from "./PrimitiveProperty";
import { ObjectProperty } from "./ObjectProperty";
import { ArrayProperty } from "./ArrayProperty";
import { PropertySerializer, SerializedProperty } from "./PropertySerializer";
import { DynamicProperty } from "./Property";
import { SerializableConstructorMap } from "./SerializableConstructorMap";

export class PropertyDeserializer implements PropertyVisitor {

    private propertyData: SerializedProperty = new SerializedProperty("MISSING CONSTRUCTOR", undefined);

    constructor(private lookup?: Map<string, object>) {
    }

    deserialize(data: SerializedProperty): DynamicProperty<any> {
        this.propertyData = data;

        const Constructor = SerializableConstructorMap.instance().getOwnerConstructor(data.constructorID);
        if (Constructor === undefined) {
            throw new Error(`Failed to deserialize property. JSON is missing a valid constructor id.`);
        }
        const property = new Constructor() as DynamicProperty<any>;

        property.accept(this);

        return property;
    }

    visitPrimitive<T extends primitive>(property: PrimitiveProperty<T>): void {
        property.set(this.propertyData.data);
    }

    visitObject<T extends object>(property: ObjectProperty<T>): void {
        if (typeof this.propertyData.data === 'string') {
            if (this.lookup) {
                const object = this.lookup.get(this.propertyData.data) as T | undefined;
                if (object) {
                    property.set(object)
                } else {
                    throw new Error(`Failed to deserialize object property. Property data was an ID, but there is no object associated with that ID.`);
                }
            } else {
                throw new Error(`Failed to deserialize object property. Property data was an ID, but there is no lookup.`);
            }
        } else {
            property.set(this.propertyData.data);
        }
    }

    visitArray<T>(property: ArrayProperty<T>): void {
        const arrayData: SerializedProperty[] = this.propertyData.data;
        if (arrayData === undefined) {
            return;
        }

        const array: DynamicProperty<T>[] = [];

        arrayData.forEach(serializedProperty => {
            array.push(new PropertyDeserializer(this.lookup).deserialize(serializedProperty));
        })

        property.set(array);
    }
}