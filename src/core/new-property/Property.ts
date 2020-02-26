import { PropertyStrategy } from "./PropertyStrategy";
import { PropertyVisitor } from "./PropertyVisitor";

export class Property<T> {
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

    copy(target: Property<T>): this {
        this.strategy.copy(this, target);
        return this;
    }

    clone(): Property<T> {
        return this.strategy.clone(this);
    }

    getStrategy(): PropertyStrategy<T> {
        return this.strategy;
    }

    accept(visitor: PropertyVisitor) {
        this.strategy.accept(this, visitor);
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
}