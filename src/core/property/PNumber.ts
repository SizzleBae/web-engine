import { PStrategy, PStrategyData } from "./PStrategy";

export class PNumber extends PStrategy<number> {

    memento(value: number | undefined, keepExternal?: boolean, lookup?: Map<object, string>): PStrategyData {
        return value;
    }

    restore(memento: number | undefined, lookup?: Map<string, object>): number | undefined {
        return memento;
    }

}