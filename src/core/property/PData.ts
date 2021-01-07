import { Serializable, META_SERIALIZABLE_ID_KEY } from "../serialize/Serializable";
import { PropertyMemento } from "./PropertyMemento";
import { PropertyUtils } from "./PropertyUtils";
import { SerializableConstructorMap } from "../serialize/SerializableConstructorMap";
import { PStrategy, PStrategyData } from "./PStrategy";

@Serializable('core.property.PData')
export class PData<T extends object> extends PStrategy<T> {

    memento(value: T, keepExternal: boolean = false, lookup: Map<object, string> = new Map()): PDataMemento {
        if (value) {
            const constructorID = Reflect.get(value.constructor, META_SERIALIZABLE_ID_KEY);

            if (constructorID) {
                const mementos: Record<string, PropertyMemento> = {};
                PropertyUtils.forEachPropertyIn(value, (property, key) => {
                    mementos[key] = property.memento(keepExternal, lookup);
                });

                return { data: { constructorID, properties: mementos } }
            }
        }

        return {};
    }

    restore(memento: PDataMemento, lookup: Map<string, object> = new Map()): T {
        if (!memento.data) {
            return undefined as any;
        }

        const Constructor = SerializableConstructorMap.instance().getOwnerConstructor(memento.data.constructorID) as { new(): T } | undefined;
        if (Constructor) {
            const object = new Constructor();

            const mementos = memento.data.properties;
            PropertyUtils.forEachPropertyIn(object, (property, key) => {
                const subMemento = mementos[key];

                if (subMemento) {
                    property.restore(subMemento, lookup);
                } else {
                    console.warn(`Missing property memento for ${key} in ${object}`);
                }
            });

            return object;
        }

        throw new Error(`Failed to restore from PData memento: Missing constructor, did you forget to use the @Serializable decorator?`)
    }
}

export type PDataMemento = {
    data?: {
        constructorID: string;
        properties: Record<string, PropertyMemento>
    }
}