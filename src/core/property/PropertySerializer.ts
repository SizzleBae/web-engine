import { PropertyVisitor } from "./PropertyVisitor";
import { primitive, PrimitiveProperty } from "./PrimitiveProperty";
import { ObjectProperty } from "./ObjectProperty";
import { ArrayProperty } from "./ArrayProperty";
import { DynamicProperty } from "./Property";
import { META_SERIALIZABLE_ID_KEY } from "./Serializable";

export class SerializedProperty {
    constructor(public constructorID: string, public data: any) { }
}

export class PropertySerializer extends PropertyVisitor {

    private result: SerializedProperty = new SerializedProperty("MISSING CONSTRUCTOR", undefined);

    constructor(
        private keepExternal: boolean = true,
        private lookup?: Map<object, string>) {
        super();
    }

    serialize(property: DynamicProperty<any>): SerializedProperty {
        this.result = new SerializedProperty("MISSING CONSTRUCTOR", undefined);

        const constructorID = Reflect.get(property.constructor, META_SERIALIZABLE_ID_KEY);
        if (constructorID === undefined) {
            throw new Error(`Failed to serialize property. DynamicProperty is missing a serializable constructor, dynamic properties need to be decorated with Serializable.`);
        }
        this.result.constructorID = constructorID;

        property.accept(this);

        return this.result;
    }

    visitPrimitive<T extends primitive>(property: PrimitiveProperty<T>): void {
        this.result.data = property.get();
    }

    visitObject<T extends object>(property: ObjectProperty<T>): void {
        const object = property.get();

        if (object === undefined) {
            this.result.data = undefined;
            return;
        }

        if (this.lookup && this.lookup.has(object)) {
            this.result.data = this.lookup.get(object);
        } else if (this.keepExternal) {
            this.result.data = object;
        }
    }

    visitArray<T>(property: ArrayProperty<T>): void {
        const array = property.get();
        if (array === undefined) {
            this.result.data = undefined;
            return;
        }

        this.result.data = [];
        array.forEach(property => {
            this.result.data.push(new PropertySerializer(this.keepExternal, this.lookup).serialize(property));
        });
    }

}