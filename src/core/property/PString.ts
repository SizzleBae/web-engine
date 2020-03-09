import { Serializable } from "./Serializable";
import { PropertyVisitor } from "./PropertyVisitor";
import { Property } from "./Property";
import { PropertyMemento } from "./PropertyMemento";

@Serializable('core.property.PString')
export class PString extends Property<string> {

    copy(source: Property<string>): this {
        this.value = source.get();
        return this;
    }

    clone(): Property<string> {
        return new PString(this.value);
    }

    memento(keepExternal?: boolean | undefined, lookup?: Map<object, string> | undefined): PropertyMemento {
        const memento = new PStringMemento();
        memento.string = this.value;
        return memento;
    }

    restore(memento: PStringMemento, lookup?: Map<string, object> | undefined): void {
        this.value = memento.string;
    }

    accept(visitor: PropertyVisitor): void {
        visitor.visitString(this);
    }

}

class PStringMemento extends PropertyMemento {
    string: string | undefined;
}