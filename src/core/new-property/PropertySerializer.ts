import { PropertyVisitor } from "./PropertyVisitor";
import { DynamicProperty } from "./DynamicProperty";
import { SerializedObject } from "./SerializedObject";
import { PropertyUtils } from "../property/PropertyUtils";

export class PropertySerializer implements PropertyVisitor {

    private result: SerializedObject = new SerializedObject();

    constructor(
        private keepExternal: boolean = true,
        private lookup: Map<object, string> = new Map<object, string>()) {
    }

    serialize(property: DynamicProperty<any>): SerializedObject {
        this.result = new SerializedObject();

        this.result.destruct(property.getStrategy());

        property.accept(this);

        return this.result;
    }

    visitString(property: DynamicProperty<string>): void {
        this.result.data = property.get();
    }

    visitNumber(property: DynamicProperty<number>): void {
        this.result.data = property.get();
    }

    visitBoolean(property: DynamicProperty<boolean>): void {
        this.result.data = property.get();
    }

    visitObjectData(property: DynamicProperty<object>): void {
        const object = property.get();
        if (object) {
            const serializedObject = new SerializedObject();

            serializedObject.destruct(object);

            PropertyUtils.forEachPropertyIn(object, (property, key) => {
                serializedObject.data[key] = new PropertySerializer(this.keepExternal, this.lookup).serialize(property);
            });

            this.result.data = serializedObject;
        }
    }

    visitObjectReference(property: DynamicProperty<object>): void {
        const object = property.get();

        if (object) {
            const referenceID = this.lookup.get(object);

            if (referenceID) {
                this.result.data.id = referenceID;
            } else if (this.keepExternal) {
                this.result.data.object = object;
            }
        }
    }

    visitArray<T>(property: DynamicProperty<DynamicProperty<T>[]>): void {
        const array = property.get();

        if (array) {
            const serializedArray = array.map(subProperty => new PropertySerializer(this.keepExternal, this.lookup).serialize(subProperty));

            this.result.data = serializedArray;
        }
    }

}