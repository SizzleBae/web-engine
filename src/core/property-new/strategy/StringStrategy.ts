import {PropertyStrategy} from "./PropertyStrategy";

export class StringStrategy extends PropertyStrategy<string, string> {
    modify(value: string): string {
        return value;
    }

    deserialize(memento: string, lookup: Map<string, object>): string {
        return memento;
    }

    serialize(value: string, keepExternal: boolean, lookup: Map<object, string>): string {
        return value;
    }
}

export const PString = ()=>new StringStrategy();