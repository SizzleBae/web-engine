import { PropertyVisitor } from "./PropertyVisitor";

export abstract class Property<T> {

    constructor(protected value?: T) { }

    get(): T | undefined {
        return this.value;
    }

    set(value: T | undefined): void {
        this.value = value;
    }

    abstract copy(source: Property<T>): this;
    abstract clone(): Property<T>;

    abstract accept(visitor: PropertyVisitor): void;

}