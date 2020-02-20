import { PropertyStrategy } from "./PropertyStrategy";
import { SerializedObject } from "./SerializedObject";
import { META_SERIALIZABLE_ID_KEY } from "../property/Serializable";
import { SerializableConstructorMap } from "../property/SerializableConstructorMap";

export class DynamicProperty<T> {
    private value: T | undefined;

    constructor(private propertyStrategy: PropertyStrategy<T>, defaultValue?: T) {
        this.value = defaultValue;
    }

    get(): T | undefined {
        return this.value;
    }

    set(value: T | undefined) {
        this.value = value;
    }

    serialize(lookup: Map<object, string>): SerializedObject {
        const result = this.propertyStrategy.serialize(this.value, lookup);

        result.destruct(this.propertyStrategy);

        return result;
    }

    deserialize(data: SerializedObject, lookup: Map<string, object>): void {
        this.propertyStrategy = data.construct() as PropertyStrategy<T>;

        this.value = this.propertyStrategy.deserialize(data, lookup);
    }

}