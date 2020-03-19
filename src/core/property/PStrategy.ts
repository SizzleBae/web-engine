import { PropertyMemento } from "./PropertyMemento";

export abstract class PStrategy<T> {

    abstract memento(value: T | undefined, keepExternal?: boolean, lookup?: Map<object, string>): PStrategyData;
    abstract restore(memento: PStrategyData, lookup?: Map<string, object>): T | undefined;

}

export interface PStrategyMemento {

}

export type PStrategyData = PStrategyMemento | string | number | boolean | undefined;