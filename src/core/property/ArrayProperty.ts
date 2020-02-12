import { DynamicProperty, SerializedProperty } from "./Property";
import { Serializable, META_SERIALIZABLE_ID_KEY } from "./Serializable";
import { SerializableConstructorMap } from "./SerializableConstructorMap";
import { PropertyVisitor } from "./PropertyVisitor";

@Serializable('core.ArrayProperty')
export class ArrayProperty<T> extends DynamicProperty<DynamicProperty<T>[]> {
    public accept(visitor: PropertyVisitor): void {
        visitor.visitArray(this);
    }

    public serialize(lookup: Map<object, string>): SerializedProperty {
        const propertyJSON = new SerializedProperty(Reflect.get(this.constructor, META_SERIALIZABLE_ID_KEY), undefined);
        if (this.value === undefined) {
            return propertyJSON;
        }

        propertyJSON['data'] = [];
        this.value.forEach(property => {
            propertyJSON['data'].push(property.serialize(lookup));
        });

        return propertyJSON;
    }

    public deserialize(lookup: Map<string, object>, property: SerializedProperty): void {
        this.value = [];
        if (property.data === undefined) {
            return;
        }

        const newArray: DynamicProperty<T>[] = [];
        property.data.forEach((property: SerializedProperty) => {
            const Constructor = SerializableConstructorMap.instance().getOwnerConstructor(property['constructorID']);

            if (Constructor === undefined) {
                throw new Error(`Failed to deserialize array property. DynamicProperty is missing a serializable constructor, dynamic properties need to be decorated with Serializable to work with arrays.`);
            }

            const constructed = new Constructor() as DynamicProperty<T>;
            constructed.deserialize(lookup, property);
            newArray.push(constructed);
        });
        this.value = newArray;
    }

    public copyFrom(source: DynamicProperty<DynamicProperty<T>[]>): void {
        const sourceArray = source.get();
        if (sourceArray === undefined) {
            this.value = undefined;
            return;
        }

        this.value = [];
        sourceArray.forEach(sourceProperty => {
            (this.value as DynamicProperty<T>[]).push(sourceProperty.clone());
        })
    }

    public clone(): DynamicProperty<DynamicProperty<T>[]> {

        if (this.value === undefined) {
            return new ArrayProperty<T>(undefined, this.readonly);
        }

        const clonedArray: DynamicProperty<T>[] = [];

        this.value.forEach(sourceProperty => {
            clonedArray.push(sourceProperty.clone());
        })

        return new ArrayProperty<T>(clonedArray, this.readonly);

    }

}