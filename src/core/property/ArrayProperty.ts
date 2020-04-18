import { DynamicProperty, PType, unsafe, safity, Value } from "./DynamicProperty";
import { PStrategyData } from "./PStrategy";
import { PropertyMemento } from "./PropertyMemento";
import { EventDelegate } from "../event/EventDelegate";
import { Serializable } from "../serialize/Serializable";

@Serializable('core.property.ArrayProperty')
export class ArrayProperty<T, S extends safity = unsafe> extends DynamicProperty<T[], S> {

    readonly onArrayChanged = new EventDelegate<void>();

    constructor(strategyType?: PType, value?: Value<T[], S>) {
        super(strategyType, value);

        this.onChanged.subscribe(data => this.onArrayChanged.emit());
    }

    memento(keepExternal?: boolean, lookup?: Map<object, string>): ArrayPropertyMemento {
        const memento = new ArrayPropertyMemento();

        const strategy = this.strategy<T>();
        if (this.value) {
            const array: PStrategyData[] = [];
            this.value.forEach(element => {
                array.push(strategy.memento(element, keepExternal, lookup));
            });
            memento.array = array;
        }

        return memento;
    }

    restore(memento: ArrayPropertyMemento, lookup?: Map<string, object>): void {

        if (memento.array) {
            const strategy = this.strategy<T>();

            const array: T[] = [];
            memento.array.forEach(data => {
                // TODO: Handle undefined?
                array.push(strategy.restore(data, lookup) as T);
            })

            this.value = array as Value<T[], S>;
        } else {
            this.value = undefined as Value<T[], S>;
        }
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

export class ArrayPropertyMemento extends PropertyMemento {
    array: PStrategyData[] | undefined;
}