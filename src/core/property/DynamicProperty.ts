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

export type unsafe = false;
export type safe = true;
export type safity = safe | unsafe;

export type Value<T, S extends safity = unsafe> = S extends safe ? T : T | undefined;

export abstract class DynamicProperty<T, S extends safity = unsafe> {
    private static readonly strategies: ReadonlyArray<PStrategy<any>> = [
        new PNumber(),
        new PBoolean(),
        new PString(),
        new PData(),
        new PReference(),
        new PProperty()
    ];

    protected value: Value<T, S>;

    readonly onChanged = new EventDelegate<{ property: DynamicProperty<T, S>, oldValue: Value<T, S>, newValue: Value<T, S> }>();

    constructor(
        public strategyType: PType = PType.Number,
        value?: Value<T, S>) {

        this.value = value as Value<T, S>;

    }

    get(): Value<T, S> {
        return this.value;
    }

    set(value: Value<T, S>): void {
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