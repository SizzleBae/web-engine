import { PStrategy, PStrategyMemento, PStrategyData } from "./PStrategy";

export class PReference<T extends object> extends PStrategy<T> {

    memento(value: T | undefined, keepExternal: boolean = false, lookup: Map<object, string> = new Map()): PStrategyData {
        const memento = new PReferenceMemento<T>();

        if (value) {
            const referenceID = lookup.get(value);

            if (referenceID) {
                memento.id = referenceID;
            } else if (keepExternal) {
                memento.object = value;
            }
        }

        return memento;
    }

    restore(memento: PReferenceMemento<T>, lookup: Map<string, object> = new Map()): T | undefined {
        if (memento.id) {
            const object = lookup.get(memento.id) as T | undefined;
            if (!object) {
                throw new Error(`Failed to deserialize object reference property - ${this}, id was found, but no object is mapped to that id in lookup table!`)
            }

            return object;
        } else {
            return memento.object;
        }
    }

    // copy(source: Property<T>): this {
    //     this.value = source.get();
    //     return this;
    // }

    // clone(): Property<T> {
    //     return new PReference(this.value);
    // }

    // accept(visitor: PropertyVisitor): void {
    //     visitor.visitReference(this);
    // }

}

class PReferenceMemento<T extends object> implements PStrategyMemento {
    id: string | undefined;
    object: T | undefined;
}