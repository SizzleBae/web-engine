import { DynamicProperty, SerializedProperty } from "./Property";
import { Serializable, META_SERIALIZABLE_ID_KEY } from "./Serializable";
import { SerializableConstructorMap } from "./SerializableConstructorMap";

@Serializable('core.ArrayProperty')
export class ArrayProperty<T extends DynamicProperty<any>> extends DynamicProperty<T[]> {

    public serialize(outJSON: any, lookup: Map<object, string>): SerializedProperty {
        const propertyJSON = new SerializedProperty(Reflect.get(this.constructor, META_SERIALIZABLE_ID_KEY), undefined);
        if (this.value === undefined) {
            return propertyJSON;
        }

        propertyJSON['data'] = [];
        this.value.forEach(property => {
            propertyJSON['data'].push(property.serialize(outJSON, lookup));
        });

        return propertyJSON;
    }

    public deserialize(inJSON: any, lookup: Map<string, object>, property: SerializedProperty): void {
        this.value = [];
        if (property.data === undefined) {
            return;
        }

        const newArray: T[] = [];
        property.data.forEach((property: SerializedProperty) => {
            const Constructor = SerializableConstructorMap.instance().getOwnerConstructor(property['constructorID']);

            if (Constructor === undefined) {
                throw new Error(`Failed to deserialize array property. DynamicProperty is missing a serializable constructor, dynamic properties need to be decorated with Serializable to work with arrays.`);
            }

            const constructed = new Constructor() as T;
            constructed.deserialize(inJSON, lookup, property);
            newArray.push(constructed);
        });
        this.value = newArray;
    }

}