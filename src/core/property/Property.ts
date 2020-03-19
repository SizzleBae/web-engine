import { DynamicProperty, PType } from "./DynamicProperty";
import { PropertyMemento } from "./PropertyMemento";
import { PStrategyData } from "./PStrategy";

export class Property<T> extends DynamicProperty<T> {

    memento(keepExternal?: boolean | undefined, lookup?: Map<object, string> | undefined): SinglePropertyMemento {
        const memento = new SinglePropertyMemento();
        memento.data = this.strategy<T>().memento(this.value, keepExternal, lookup);
        return memento;
    }

    restore(memento: SinglePropertyMemento, lookup?: Map<string, object> | undefined): void {
        this.value = this.strategy<T>().restore(memento.data, lookup);
    }

}

export class SinglePropertyMemento extends PropertyMemento {
    public data: PStrategyData;
}