
import { Property } from "./Property";
import { PropertyVisitor } from "./PropertyVisitor";
import { Serializable, META_SERIALIZABLE_ID_KEY } from "../serialize/Serializable";
import { PropertyMemento } from "./PropertyMemento";
import { SerializableConstructorMap } from "../serialize/SerializableConstructorMap";

@Serializable('core.property.PArray')
export class PArray<T> extends Property<Property<T>[]> {

    copy(source: Property<Property<T>[]>): this {
        const sourceArray = source.get();
        if (sourceArray) {
            const clonedArray = sourceArray.map(sourceProperty => sourceProperty.clone());
            this.value = clonedArray;
        }
        return this;
    }

    clone(): Property<Property<T>[]> {
        return new PArray<T>(undefined).copy(this);
    }

    memento(keepExternal?: boolean | undefined, lookup?: Map<object, string> | undefined): PropertyMemento {
        const memento = new PArrayMemento();

        this.value?.forEach(subProperty => {
            memento.array.push({
                constructorID: Reflect.get(subProperty.constructor, META_SERIALIZABLE_ID_KEY),
                memento: subProperty.memento(keepExternal, lookup)
            });
        });

        return memento;
    }

    restore(memento: PArrayMemento, lookup?: Map<string, object> | undefined): void {
        this.value = [];

        if (memento.array) {
            memento.array.forEach(element => {
                const SubProperty = SerializableConstructorMap.instance().getOwnerConstructor(element.constructorID);

                if (SubProperty) {
                    const subProperty = new SubProperty() as Property<T>;

                    subProperty.restore(element.memento, lookup);

                    this.value?.push(subProperty);
                } else {
                    throw new Error(`Failed to construct property, missing constructor ID. Did you forget to add Serializable decorator to a property?`);
                }
            })
        };
    }

    accept(visitor: PropertyVisitor): void {
        visitor.visitArray(this);
    }
}

class PArrayMemento extends PropertyMemento {
    array: { constructorID: string, memento: PropertyMemento }[] = [];
}