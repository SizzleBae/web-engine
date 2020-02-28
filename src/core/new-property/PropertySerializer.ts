import { PropertyVisitor } from "./PropertyVisitor";
import { Property } from "./Property";
import { SerializedObject } from "./SerializedObject";
import { PropertyUtils } from "../property/PropertyUtils";

export class PropertySerializer implements PropertyVisitor {

    private result: SerializedObject = new SerializedObject();

    constructor(
        private keepExternal: boolean = true,
        private lookup: Map<object, string> = new Map<object, string>()) {
    }

    serialize(property: Property<any>): SerializedObject {
        this.result = new SerializedObject();

        this.result.destruct(property.strategy);

        property.accept(this);

        return this.result;
    }

    visitString(property: Property<string>): void {
        this.result.data = property.get();
    }

    visitNumber(property: Property<number>): void {
        this.result.data = property.get();
    }

    visitBoolean(property: Property<boolean>): void {
        this.result.data = property.get();
    }

    visitObjectData(property: Property<object>): void {
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

    visitObjectReference(property: Property<object>): void {
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

    visitArray<T>(property: Property<Property<T>[]>): void {
        const array = property.get();

        if (array) {
            const serializedArray = array.map(subProperty => new PropertySerializer(this.keepExternal, this.lookup).serialize(subProperty));

            this.result.data = serializedArray;
        }
    }

}