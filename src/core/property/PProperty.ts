import { PStrategy, PStrategyData } from "./PStrategy";
import { DynamicProperty, PType } from "./DynamicProperty";
import { PropertyMemento } from "./PropertyMemento";
import { META_SERIALIZABLE_ID_KEY } from "../serialize/Serializable";
import { SerializableConstructorMap } from "../serialize/SerializableConstructorMap";

export class PProperty<T extends DynamicProperty<U>, U> extends PStrategy<T> {

    memento(value: T, keepExternal?: boolean, lookup?: Map<object, string>): PStrategyData {
        if (value) {
            return {
                constructorID: Reflect.get(value, META_SERIALIZABLE_ID_KEY),
                memento: value.memento(keepExternal, lookup),
                strategyType: value.strategyType
            }
        }
        return {};
    }

    restore(memento: PPropertyMemento, lookup?: Map<string, object>): T {
        if (memento.data) {
            const Property = SerializableConstructorMap.instance().getOwnerConstructor(memento.data.constructorID) as (new (type: PType) => T) | undefined;
            if (Property) {
                const property = new Property(memento.data.strategyType);
                property.restore(memento.data.memento, lookup);
                return property;
            } else {
                console.error(`Missing constructor for property ${memento.data.memento}! All properties should be decorated with @Serializable`)
            }
        }
        return undefined as any;
    }

}

export type PPropertyMemento = {
    data?: { constructorID: string, strategyType: PType, memento: PropertyMemento };
}

