import { PropertyStrategy } from "./PropertyStrategy";
import { SerializedObject } from "./SerializedObject";
import { PropertyVisitor } from "./PropertyVisitor";

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

    accept(visitor: PropertyVisitor) {
        this.propertyStrategy.accept(visitor, this);
    }

}