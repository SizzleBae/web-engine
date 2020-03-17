import { Property } from "./Property";

export class ArrayProperty<T> extends Property<T[]> {

    memento(keepExternal?: boolean | undefined, lookup?: Map<object, string> | undefined): PropertyMemento {

    }

    restore(memento: PropertyMemento, lookup?: Map<string, object> | undefined): void {

    }

}