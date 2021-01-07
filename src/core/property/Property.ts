import { DynamicProperty } from "./DynamicProperty";
import { PStrategyData } from "./PStrategy";
import { Serializable } from "../serialize/Serializable";

@Serializable('core.property.Property')
export class Property<T> extends DynamicProperty<T> {

    memento(keepExternal?: boolean | undefined, lookup?: Map<object, string> | undefined): SinglePropertyMemento {
        return { data: this.strategy<T>().memento(this.value, keepExternal, lookup) };
    }

    restore(memento: SinglePropertyMemento, lookup?: Map<string, object> | undefined): void {
        this.value = this.strategy<T>().restore(memento.data, lookup);
    }

}

export type SinglePropertyMemento = {
    data: PStrategyData;
}