import {PropertyStrategy} from "./PropertyStrategy";

type PReferenceMemento = {
    id?: string,
    object?: object
}

// We have to use | Function in order to allow for abstract classes that does not contain a concrete constructor
export type Constructable<T> = {new(...args:any[]):T} | Function;

export class ReferenceStrategy<T extends object> extends PropertyStrategy<T, PReferenceMemento> {
    constructor(public type: Constructable<T>) {
        super();
    }
    
    serialize(value: T, keepExternal: boolean, lookup: Map<object, string>): PReferenceMemento {
        const referenceID = lookup.get(value);

        if (referenceID) {
            return { id: referenceID };
        } else if (keepExternal) {
            return { object: value };
        }
        
        throw new Error(`ReferenceStrategy: Failed to serialize. Object is not in lookup and keepExternal is false.`);
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
        
        throw new Error(`ReferenceStrategy: Failed to deserialize. Memento did not contain an object`);
    }

    modify(value: T): T {
        return value;
    }

    createEmpty(): T {
        throw new ReferenceError("Can not create an empty reference.");
    }
}

export const PRef = <T extends object>(type: Constructable<T>)=>new ReferenceStrategy<T>(type);