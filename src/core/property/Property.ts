import { PropertyVisitor } from "./PropertyVisitor";
import { PropertyMemento } from "./PropertyMemento";
import { EventDelegate } from "../event/EventDelegate";

export abstract class Property<T> {

    readonly onChanged = new EventDelegate<{ property: Property<T>, oldValue: T | undefined, newValue: T | undefined }>();

    constructor(protected value?: T) { }

    get(): T | undefined {
        return this.value;
    }

    set(value: T | undefined): void {
        this.onChanged.emit({ property: this, oldValue: this.value, newValue: value });
        this.value = value;
    }

    abstract copy(source: Property<T>): this;
    abstract clone(): Property<T>;

    abstract memento(keepExternal?: boolean, lookup?: Map<object, string>): PropertyMemento;
    abstract restore(memento: PropertyMemento, lookup?: Map<string, object>): void;

    abstract accept(visitor: PropertyVisitor): void;

}