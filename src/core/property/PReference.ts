import { Serializable } from "../serialize/Serializable";
import { PropertyVisitor } from "./PropertyVisitor";
import { Property } from "./Property";
import { PropertyMemento } from "./PropertyMemento";

@Serializable('core.property.PReference')
export class PReference<T extends object> extends Property<T> {

    memento(keepExternal: boolean = false, lookup: Map<object, string> = new Map()): PropertyMemento {
        const memento = new PReferenceMemento<T>();

        if (this.value) {
            const referenceID = lookup.get(this.value);

            if (referenceID) {
                memento.id = referenceID;
            } else if (keepExternal) {
                memento.object = this.value;
            }
        }

        return memento;
    }

    restore(memento: PReferenceMemento<T>, lookup: Map<string, object> = new Map()): void {
        if (memento.id) {
            const object = lookup.get(memento.id) as T | undefined;
            if (!object) {
                throw new Error(`Failed to deserialize object reference property - ${this}, id was found, but no object is mapped to that id in lookup table!`)
            }

            this.value = object;
        } else {
            this.value = memento.object;
        }
    }

    copy(source: Property<T>): this {
        this.value = source.get();
        return this;
    }

    clone(): Property<T> {
        return new PReference(this.value);
    }

    accept(visitor: PropertyVisitor): void {
        visitor.visitReference(this);
    }

}

class PReferenceMemento<T extends object> extends PropertyMemento {
    id: string | undefined;
    object: T | undefined;
}