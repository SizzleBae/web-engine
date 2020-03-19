import { PStrategyData, PStrategy } from "./PStrategy";

export class PString extends PStrategy<string> {

    memento(value: string | undefined, keepExternal?: boolean, lookup?: Map<object, string>): PStrategyData {
        return value;
    }

    restore(memento: string | undefined, lookup?: Map<string, object>): string | undefined {
        return memento;
    }

}