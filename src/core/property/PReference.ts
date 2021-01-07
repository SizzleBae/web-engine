import { PStrategy, PStrategyData } from "./PStrategy";

export class PReference<T extends object> extends PStrategy<T> {

    memento(value: T, keepExternal: boolean = false, lookup: Map<object, string> = new Map()): PStrategyData {

        if (value) {
            const referenceID = lookup.get(value);

            if (referenceID) {
                return { id: referenceID };
            } else if (keepExternal) {
                return { object: value };
            }
        }

        return {};
    }

    restore(memento: PReferenceMemento<T>, lookup: Map<string, object> = new Map()): T {
        if (memento.id) {
            const object = lookup.get(memento.id) as T | undefined;
            if (!object) {
                throw new Error(`Failed to deserialize object reference property - ${this}, id was found, but no object is mapped to that id in lookup table!`)
            }

            return object;
        } else if (memento.object) {
            return memento.object;
        }
        return undefined as any;
    }
}

export type PReferenceMemento<T extends object> = {
    id?: string;
    object?: T;
}