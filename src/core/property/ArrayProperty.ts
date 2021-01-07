import { DynamicProperty, PType } from "./DynamicProperty";
import { PStrategyData } from "./PStrategy";
import { PropertyMemento } from "./PropertyMemento";
import { EventDelegate } from "../event/EventDelegate";
import { Serializable } from "../serialize/Serializable";

@Serializable('core.property.ArrayProperty')
export class ArrayProperty<T> extends DynamicProperty<T[]> {

    readonly onArrayChanged = new EventDelegate<void>();

    constructor(strategyType: PType, value: T[]) {
        super(strategyType, value);

        this.onChanged.subscribe(data => this.onArrayChanged.emit());
    }

    memento(keepExternal?: boolean, lookup?: Map<object, string>): ArrayPropertyMemento {

        const strategy = this.strategy<T>();
        const array: PStrategyData[] = [];
        this.value.forEach(element => {
            array.push(strategy.memento(element, keepExternal, lookup));
        });

        return { array };
    }

    restore(memento: ArrayPropertyMemento, lookup?: Map<string, object>): void {

        const strategy = this.strategy<T>();

        const array: T[] = [];
        memento.array.forEach(data => {
            // TODO: Handle undefined?
            array.push(strategy.restore(data, lookup) as T);
        })

        this.value = array;
    }

    replace(index: number, newElement: T): void {
        if (this.value) {
            this.value[index] = newElement;

            this.onArrayChanged.emit();
        } else {
            throw new Error(`Attempted to set element in array property when array is undefined!`);
        }
    }
}

export type ArrayPropertyMemento = {
    array: PStrategyData[]
}