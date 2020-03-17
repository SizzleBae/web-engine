import { PropertyMemento } from "./PropertyMemento";

export abstract class PStrategy<T> {

    abstract memento(value: T | undefined, keepExternal?: boolean, lookup?: Map<object, string>): any;
    abstract restore(memento: PropertyMemento, lookup?: Map<string, object>): T | undefined;

}