import { DynamicProperty } from "./DynamicProperty";
import { PStrategyData } from "./PStrategy";
import { PropertyMemento } from "./PropertyMemento";
import { EventDelegate } from "../event/EventDelegate";
import { Serializable } from "../serialize/Serializable";

@Serializable('core.property.ArrayProperty')
export class ArrayProperty<T> extends DynamicProperty<T[]> {

    readonly onArrayChanged = new EventDelegate<void>();

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

            this.value = array;
        } else {
            this.value = undefined;
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