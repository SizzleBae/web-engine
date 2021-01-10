import {PropertyStrategy} from "./PropertyStrategy";

export class BooleanStrategy extends PropertyStrategy<boolean, boolean> {

    serialize(value: boolean, keepExternal: boolean, lookup: Map<object, string>): boolean {
        return value;
    }

    deserialize(memento: boolean, lookup: Map<string, object>): boolean {
        return memento;
    }

    modify(value: boolean): boolean {
        return value;
    }
}

export const PBoolean = ()=>new BooleanStrategy();