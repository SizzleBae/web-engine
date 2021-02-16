import {PropertyStrategy} from "./PropertyStrategy";
import {META_SERIALIZABLE_ID_KEY} from "../../serialize/Serializable";
import {PropertyUtils} from "../../property/PropertyUtils";
import {SerializableConstructorMap} from "../../serialize/SerializableConstructorMap";

type PDataMemento = {
    constructorID: string,
    properties: Record<string, any>
}

export class DataStrategy<T extends object> extends PropertyStrategy<T, PDataMemento> {
    serialize(value: T, keepExternal: boolean, lookup: Map<object, string>): PDataMemento {
        const constructorID = Reflect.get(value.constructor, META_SERIALIZABLE_ID_KEY);

        if (constructorID) {
            const mementos: Record<string, any> = {};
            PropertyUtils.forEachPropertyIn(value, (property, key) => {
                mementos[key] = property.memento(keepExternal, lookup);
            });

            return {  constructorID, properties: mementos }
        }
        
        throw new Error(`DataStrategy: Missing constructor id metadata for stored object.`)
    }
    
    deserialize(memento: PDataMemento, lookup: Map<string, object>): T {
        const StoredObject = SerializableConstructorMap.instance().getOwnerConstructor(memento.constructorID) as { new(): T } | undefined;
        if (!StoredObject) {
            throw new Error(`Failed to restore from PData memento: Missing constructor, did you forget to use the @Serializable decorator?`)
        }
        
        const object = new StoredObject();

        PropertyUtils.forEachPropertyIn(object, (property, key) => {
            const subMemento = memento.properties[key];

            if (subMemento) {
                property.restore(subMemento, lookup);
            } else {
                console.warn(`Missing property memento for ${key} in ${object}`);
            }
        });

        return object;
    }

    modify(value: T): T {
        return value;
    }

    createEmpty(): T {
        throw new ReferenceError("Can not create an empty data object.");
    }
}

export const PData = <T extends object = never>()=>new DataStrategy<T>();