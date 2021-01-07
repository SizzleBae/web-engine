import { PropertyMemento } from "./PropertyMemento";
import { EventDelegate } from "../event/EventDelegate";
import { PStrategy } from "./PStrategy";
import { PReference } from "./PReference";
import { PNumber } from "./PNumber";
import { PBoolean } from "./PBoolean";
import { PString } from "./PString";
import { PData } from "./PData";
import { PProperty } from "./PProperty";

export enum PType {
    Number, Boolean, String, Data, Reference, Property
}

export abstract class DynamicProperty<T> {
    private static readonly strategies: ReadonlyArray<PStrategy<any>> = [
        new PNumber(),
        new PBoolean(),
        new PString(),
        new PData(),
        new PReference(),
        new PProperty()
    ];

    readonly onChanged = new EventDelegate<{ property: DynamicProperty<T>, oldValue: T, newValue: T }>();

    constructor(
        public strategyType: PType,
        protected value: T) {

    }

    get(): T {
        return this.value;
    }

    set(value: T): void {
        this.onChanged.emit({ property: this, oldValue: this.value, newValue: value });
        this.value = value;
    }

    protected strategy<T>(): PStrategy<T> {
        return DynamicProperty.strategies[this.strategyType];
    }

    abstract memento(keepExternal?: boolean, lookup?: Map<object, string>): PropertyMemento;
    abstract restore(memento: PropertyMemento, lookup?: Map<string, object>): void;

    // abstract copy(source: Property<T>): this;
    // abstract clone(): Property<T>;
    // abstract accept(visitor: PropertyVisitor): void;

}