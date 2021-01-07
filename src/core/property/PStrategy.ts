import { PropertyMemento } from "./PropertyMemento";

export abstract class PStrategy<T> {

    abstract memento(value: T, keepExternal?: boolean, lookup?: Map<object, string>): PStrategyData;
    abstract restore(memento: PStrategyData, lookup?: Map<string, object>): T;

}

export type PStrategyData = object | string | number | boolean | undefined;