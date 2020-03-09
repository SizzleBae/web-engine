import { Serializable } from "./Serializable";
import { PropertyVisitor } from "./PropertyVisitor";
import { Property } from "./Property";
import { PropertyMemento } from "./PropertyMemento";

@Serializable('core.property.PData')
export class PData<T extends object> extends Property<T> {

    copy(source: Property<T>): this {
        this.value = source.get();
        return this;
    }

    clone(): Property<T> {
        return new PData(this.value);
    }

    memento(): PropertyMemento {
        const memento = new PDataMemento();



        // const object = property.get();
        // if (object) {
        //     const serializedObject = new SerializedObject();

        //     serializedObject.destruct(object);

        //     PropertyUtils.forEachPropertyIn(object, (property, key) => {
        //         serializedObject.data[key] = new PropertySerializer(this.keepExternal, this.lookup).serialize(property);
        //     });

        //     this.serializedProperty.data = serializedObject;
        // }

    }

    restore(memento: PropertyMemento): void {

    }

    accept(visitor: PropertyVisitor): void {
        visitor.visitData(this);
    }

}

class PDataMemento extends PropertyMemento {
    constructorID: string = "";
    properties: Record<string, PropertyMemento> = {};
}