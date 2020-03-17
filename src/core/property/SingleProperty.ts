import { Property, StrategyType } from "./Property";
import { PropertyMemento } from "./PropertyMemento";

export class SingleProperty<T> extends Property<T> {

    memento(keepExternal?: boolean | undefined, lookup?: Map<object, string> | undefined): PropertyMemento {
        return this.strategy().memento(this.value, keepExternal, lookup);
    }

    restore(memento: PropertyMemento, lookup?: Map<string, object> | undefined): void {
        this.value = this.strategy().restore(memento, lookup);
    }

}