import { DynamicProperty } from "./DynamicProperty";
import { PStrategyData } from "./PStrategy";
import { PropertyMemento } from "./PropertyMemento";

export class ArrayProperty<T> extends DynamicProperty<T[]> {

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

}

export class ArrayPropertyMemento extends PropertyMemento {
    array: PStrategyData[] | undefined;
}