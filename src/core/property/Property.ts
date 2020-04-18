import { DynamicProperty, Value, unsafe, safity } from "./DynamicProperty";
import { PropertyMemento } from "./PropertyMemento";
import { PStrategyData } from "./PStrategy";
import { Serializable } from "../serialize/Serializable";

@Serializable('core.property.Property')
export class Property<T, S extends safity = unsafe> extends DynamicProperty<T, S> {

    memento(keepExternal?: boolean | undefined, lookup?: Map<object, string> | undefined): SinglePropertyMemento {
        const memento = new SinglePropertyMemento();
        memento.data = this.strategy<T>().memento(this.value, keepExternal, lookup);
        return memento;
    }

    restore(memento: SinglePropertyMemento, lookup?: Map<string, object> | undefined): void {
        this.value = this.strategy<T>().restore(memento.data, lookup) as Value<T, S>;
    }

}

export class SinglePropertyMemento extends PropertyMemento {
    public data: PStrategyData;
}