import { Serializable, META_SERIALIZABLE_ID_KEY } from "./Serializable";
import { PropertyVisitor } from "./PropertyVisitor";
import { Property } from "./Property";
import { PropertyMemento } from "./PropertyMemento";
import { PropertyUtils } from "./PropertyUtils";
import { SerializableConstructorMap } from "./SerializableConstructorMap";

@Serializable('core.property.PData')
export class PData<T extends object> extends Property<T> {

    copy(source: Property<T>): this {
        this.value = source.get();
        return this;
    }

    clone(): Property<T> {
        return new PData(this.value);
    }

    memento(keepExternal?: boolean, lookup?: Map<object, string>): PropertyMemento {
        const memento = new PDataMemento();

        if (this.value) {
            const constructorID = Reflect.get(this.value.constructor, META_SERIALIZABLE_ID_KEY);

            if (constructorID) {
                memento.constructorID = constructorID;

                PropertyUtils.forEachPropertyIn(this.value, (property, key) => {
                    memento.properties[key] = property.memento(keepExternal, lookup);
                });

            }
        }

        return memento;
    }

    restore(memento: PDataMemento<T>, lookup?: Map<string, object>): void {
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

            this.value = object;
        }
    }

    accept(visitor: PropertyVisitor): void {
        visitor.visitData(this);
    }

}

class PDataMemento<T extends object> extends PropertyMemento {
    constructorID: string = "";
    properties: Record<string, PropertyMemento> = {};
}