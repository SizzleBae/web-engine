import { PropertyVisitor } from "./PropertyVisitor";
import { PropertyMemento } from "./PropertyMemento";
import { EventDelegate } from "../event/EventDelegate";
import { PStrategy } from "./PStrategy";
import { PReference } from "./PReference";

export enum StrategyType {
    Number, Boolean, String, Data, Reference
}

export abstract class Property<T> {

    protected static readonly strategies: ReadonlyArray<PStrategy<any>> = [
        new PReference()
    ];

    readonly onChanged = new EventDelegate<{ property: Property<T>, oldValue: T | undefined, newValue: T | undefined }>();

    constructor(
        protected strategyType: StrategyType = StrategyType.Number,
        protected value?: T) { }

    get(): T | undefined {
        return this.value;
    }

    set(value: T | undefined): void {
        this.onChanged.emit({ property: this, oldValue: this.value, newValue: value });
        this.value = value;
    }

    protected strategy(): PStrategy<T> {
        return Property.strategies[this.strategyType];
    }

    abstract memento(keepExternal?: boolean, lookup?: Map<object, string>): PropertyMemento;
    abstract restore(memento: PropertyMemento, lookup?: Map<string, object>): void;

    // abstract copy(source: Property<T>): this;
    // abstract clone(): Property<T>;
    // abstract accept(visitor: PropertyVisitor): void;

}