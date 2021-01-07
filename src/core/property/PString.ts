import { PStrategyData, PStrategy } from "./PStrategy";

export class PString extends PStrategy<string> {

    memento(value: string, keepExternal?: boolean, lookup?: Map<object, string>): PStrategyData {
        return value;
    }

    restore(memento: string, lookup?: Map<string, object>): string {
        return memento;
    }

}