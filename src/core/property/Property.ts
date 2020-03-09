import { PropertyVisitor } from "./PropertyVisitor";
import { PropertyMemento } from "./PropertyMemento";

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

    abstract memento(keepExternal?: boolean, lookup?: Map<object, string>): PropertyMemento;
    abstract restore(memento: PropertyMemento, lookup?: Map<string, object>): void;

    abstract accept(visitor: PropertyVisitor): void;

}