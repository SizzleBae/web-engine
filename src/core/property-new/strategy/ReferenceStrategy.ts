import {PropertyStrategy} from "./PropertyStrategy";

type PReferenceMemento = {
    id?: string,
    object?: object
}

export class ReferenceStrategy<T extends object> extends PropertyStrategy<T, PReferenceMemento> {
    serialize(value: T, keepExternal: boolean, lookup: Map<object, string>): PReferenceMemento {
        const referenceID = lookup.get(value);

        if (referenceID) {
            return { id: referenceID };
        } else if (keepExternal) {
            return { object: value };
        }

        return {};
    }
    
    deserialize(memento: PReferenceMemento, lookup: Map<string, object>): T {
        if (memento.id) {
            const object = lookup.get(memento.id) as T;
            if (!object) {
                throw new Error(`Failed to deserialize object reference property - ${this}, id was found, but no object is mapped to that id in lookup table!`)
            }

            return object;
        } else if (memento.object) {
            return memento.object as T;
        }
        throw new Error(`ReferenceStrategy: Memento did not contain an object`);
    }

    modify(value: T): T {
        return value;
    }
}

export const PRef = <T extends object>()=>new ReferenceStrategy<T>();