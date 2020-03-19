import { Serializable, META_SERIALIZABLE_ID_KEY } from "../serialize/Serializable";
import { PropertyVisitor } from "./PropertyVisitor";
import { DynamicProperty } from "./DynamicProperty";
import { PropertyMemento } from "./PropertyMemento";
import { PropertyUtils } from "./PropertyUtils";
import { SerializableConstructorMap } from "../serialize/SerializableConstructorMap";
import { PStrategy, PStrategyData, PStrategyMemento } from "./PStrategy";

@Serializable('core.property.PData')
export class PData<T extends object> extends PStrategy<T> {

    // copy(source: Property<T>): this {
    //     this.value = source.get();
    //     return this;
    // }

    // clone(): Property<T> {
    //     return new PData(this.value);
    // }

    memento(value: T | undefined, keepExternal: boolean = false, lookup: Map<object, string> = new Map()): PStrategyData {
        const memento = new PDataMemento();

        if (value) {
            const constructorID = Reflect.get(value.constructor, META_SERIALIZABLE_ID_KEY);

            if (constructorID) {
                memento.constructorID = constructorID;

                PropertyUtils.forEachPropertyIn(value, (property, key) => {
                    memento.properties[key] = property.memento(keepExternal, lookup);
                });

            }
        }

        return memento;
    }

    restore(memento: PDataMemento, lookup: Map<string, object> = new Map()): T | undefined {
        const Constructor = SerializableConstructorMap.instance().getOwnerConstructor(memento.constructorID);

        if (Constructor) {
            const object = new Constructor() as T;

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

        return undefined;
    }

    // accept(visitor: PropertyVisitor): void {
    //     visitor.visitData(this);
    // }

}

class PDataMemento implements PStrategyMemento {
    constructorID: string = "";
    properties: Record<string, PropertyMemento> = {};
}