import { PropertyVisitor } from "./PropertyVisitor";
import { Property } from "./Property";
import { SerializedObject } from "./SerializedObject";
import { PropertyUtils } from "./PropertyUtils";

export class PropertySerializer implements PropertyVisitor {

    private serializedProperty: SerializedObject = new SerializedObject();

    constructor(
        private keepExternal: boolean = true,
        private lookup: Map<object, string> = new Map<object, string>()) {
    }

    serialize(property: Property<any>): SerializedObject {
        this.serializedProperty = new SerializedObject();

        this.serializedProperty.destruct(property);

        property.accept(this);

        return this.serializedProperty;
    }

    visitString(property: Property<string>): void {
        this.serializedProperty.data = property.get();
    }

    visitNumber(property: Property<number>): void {
        this.serializedProperty.data = property.get();
    }

    visitBoolean(property: Property<boolean>): void {
        this.serializedProperty.data = property.get();
    }

    visitData<T extends object>(property: Property<T>): void {
        const object = property.get();
        if (object) {
            const serializedObject = new SerializedObject();

            serializedObject.destruct(object);

            PropertyUtils.forEachPropertyIn(object, (property, key) => {
                serializedObject.data[key] = new PropertySerializer(this.keepExternal, this.lookup).serialize(property);
            });

            this.serializedProperty.data = serializedObject;
        }
    }

    visitReference<T extends object>(property: Property<T>): void {
        const object = property.get();

        if (object) {
            const referenceID = this.lookup.get(object);

            if (referenceID) {
                this.serializedProperty.data.id = referenceID;
            } else if (this.keepExternal) {
                this.serializedProperty.data.object = object;
            }
        }
    }

    visitArray<T>(property: Property<Property<T>[]>): void {
        const array = property.get();

        if (array) {
            const serializedArray = array.map(subProperty => new PropertySerializer(this.keepExternal, this.lookup).serialize(subProperty));

            this.serializedProperty.data = serializedArray;
        }
    }

}