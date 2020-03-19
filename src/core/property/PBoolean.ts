import { PStrategy, PStrategyData } from "./PStrategy";

export class PBoolean extends PStrategy<boolean> {

    memento(value: boolean | undefined, keepExternal?: boolean, lookup?: Map<object, string>): PStrategyData {
        return value;
    }

    restore(memento: boolean | undefined, lookup?: Map<string, object>): boolean | undefined {
        return memento;
    }

}
