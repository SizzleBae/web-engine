import { PropertyVisitor } from "./PropertyVisitor";
import { primitive, PrimitiveProperty } from "./PrimitiveProperty";
import { ObjectProperty } from "./ObjectProperty";
import { ArrayProperty } from "./ArrayProperty";
import { SerializedProperty, DynamicProperty } from "./Property";
import { META_SERIALIZABLE_ID_KEY } from "./Serializable";

export class PropertySerializer extends PropertyVisitor {

    private result: SerializedProperty = new SerializedProperty("", undefined);

    serialize(property: DynamicProperty<any>): SerializedProperty {
        property.accept(this);
        this.result.constructorID = Reflect.get(property.constructor, META_SERIALIZABLE_ID_KEY);
        return this.result;
    }

    visitPrimitive<T extends primitive>(property: PrimitiveProperty<T>): void {
        this.result.data = property.get();
    }

    visitObject<T extends object>(property: ObjectProperty<T>): void {

        let objectData: T | string | undefined;

        if (this.value !== undefined) {
            if (lookup.has(this.value)) {
                objectData = lookup.get(this.value);
            } else {
                objectData = this.value;
            }
        }

        return new SerializedProperty(Reflect.get(this.constructor, META_SERIALIZABLE_ID_KEY), objectData);

    }

    visitArray<T>(property: ArrayProperty<T>): void {
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

}