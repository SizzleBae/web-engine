import { PropertyStrategy } from "./PropertyStrategy";
import { SerializedObject } from "./SerializedObject";
import { PropertyVisitor } from "./PropertyVisitor";
import { StringStrategy } from "./StringStrategy";
import { NumberStrategy } from "./NumberStrategy";
import { BooleanStrategy } from "./BooleanStrategy";
import { ObjectDataStrategy } from "./ObjectDataStrategy";
import { UndefinedStrategy } from "./UndefinedStrategy";
import { ObjectReferenceStrategy } from "./ObjectReferenceStrategy";

export class DynamicProperty<T> {
    constructor(
        private strategy: PropertyStrategy<T>,
        private value?: T) {
    }

    get(): T | undefined {
        return this.value;
    }

    set(value: T | undefined) {
        this.value = value;
    }

    // findStrategy(): PropertyStrategy<any> {
    //     switch (typeof this.value) {
    //         case 'string':
    //             return new StringStrategy();
    //         case 'number':
    //             return new NumberStrategy();
    //         case 'boolean':
    //             return new BooleanStrategy();
    //         case 'object':
    //             return new ObjectDataStrategy();
    //     }

    //     return new UndefinedStrategy();
    // }

    // reference(): this {
    //     if (this.propertyStrategy instanceof ObjectDataStrategy) {
    //         this.propertyStrategy = new ObjectReferenceStrategy() as PropertyStrategy<any>;
    //     }
    //     return this;
    // }

    // serialize(lookup: Map<object, string>): SerializedObject {
    //     const result = this.propertyStrategy.serialize(this.value, lookup);

    //     result.destruct(this.propertyStrategy);

    //     return result;
    // }

    // deserialize(data: SerializedObject, lookup: Map<string, object>): void {
    //     this.propertyStrategy = data.construct() as PropertyStrategy<T>;

    //     this.value = this.propertyStrategy.deserialize(data, lookup);
    // }

    copy(target: DynamicProperty<T>): this {
        this.strategy.copy(target);
        return this;
    }

    getStrategy(): PropertyStrategy<T> {
        return this.strategy;
    }

    accept(visitor: PropertyVisitor) {
        this.strategy.accept(visitor, this);
    }

}