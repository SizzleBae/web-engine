import { PStrategy, PStrategyData, PStrategyMemento } from "./PStrategy";
import { DynamicProperty, PType } from "./DynamicProperty";
import { PropertyMemento } from "./PropertyMemento";
import { META_SERIALIZABLE_ID_KEY } from "../serialize/Serializable";
import { SerializableConstructorMap } from "../serialize/SerializableConstructorMap";

export class PProperty<T extends DynamicProperty<U>, U> extends PStrategy<T> {

    memento(value: T | undefined, keepExternal?: boolean, lookup?: Map<object, string>): PStrategyData {
        const memento = new PPropertyMemento();
        if (value) {
            memento.data = {
                constructorID: Reflect.get(value, META_SERIALIZABLE_ID_KEY),
                memento: value.memento(keepExternal, lookup),
                strategyType: value.strategyType
            }
        }
        return memento;
    }

    restore(memento: PPropertyMemento, lookup?: Map<string, object>): T | undefined {
        if (memento.data) {
            const Property = SerializableConstructorMap.instance().getOwnerConstructor(memento.data.constructorID) as any as (new (type: PType) => T);
            if (Property) {
                const property = new Property(memento.data.strategyType);
                property.restore(memento.data.memento, lookup);
                return property;
            } else {
                console.error(`Missing constructor for property ${memento.data.memento}! All properties should be decorated with @Serializable`)
            }
        }
        return undefined;
    }

}

class PPropertyMemento implements PStrategyMemento {
    data: { constructorID: string, strategyType: PType, memento: PropertyMemento } | undefined;
}

