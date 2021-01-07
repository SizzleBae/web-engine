import { PStrategy, PStrategyData } from "./PStrategy";

export class PNumber extends PStrategy<number> {

    memento(value: number, keepExternal?: boolean, lookup?: Map<object, string>): PStrategyData {
        return value;
    }

    restore(memento: number, lookup?: Map<string, object>): number {
        return memento;
    }

}