import { Serializable } from "./Serializable";
import { PropertyVisitor } from "./PropertyVisitor";
import { Property } from "./Property";
import { PropertyMemento } from "./PropertyMemento";

@Serializable('core.property.PNumber')
export class PNumber extends Property<number> {

    copy(source: Property<number>): this {
        this.value = source.get();
        return this;
    }

    clone(): Property<number> {
        return new PNumber(this.value);
    }

    memento(keepExternal?: boolean | undefined, lookup?: Map<object, string> | undefined): PropertyMemento {
        const memento = new PNumberMemento();
        memento.number = this.value;
        return memento;
    }

    restore(memento: PNumberMemento, lookup?: Map<string, object> | undefined): void {
        this.value = memento.number;
    }

    accept(visitor: PropertyVisitor): void {
        visitor.visitNumber(this);
    }
}

class PNumberMemento extends PropertyMemento {
    number: number | undefined;
}