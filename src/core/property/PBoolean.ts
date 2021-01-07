import { PStrategy, PStrategyData } from "./PStrategy";

export class PBoolean extends PStrategy<boolean> {

    memento(value: boolean, keepExternal?: boolean, lookup?: Map<object, string>): PStrategyData {
        return value;
    }

    restore(memento: boolean, lookup?: Map<string, object>): boolean {
        return memento;
    }

}
