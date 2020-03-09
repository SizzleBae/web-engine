import { Serializable } from "./Serializable";
import { PropertyVisitor } from "./PropertyVisitor";
import { Property } from "./Property";
import { PropertyMemento } from "./PropertyMemento";

@Serializable('core.property.PBoolean')
export class PBoolean extends Property<boolean> {

    copy(source: Property<boolean>): this {
        this.value = source.get();
        return this;
    }

    clone(): Property<boolean> {
        return new PBoolean(this.value);
    }

    accept(visitor: PropertyVisitor): void {
        visitor.visitBoolean(this);
    }

    memento(keepExternal?: boolean | undefined, lookup?: Map<object, string> | undefined): PropertyMemento {
        const memento = new PBooleanMemento();
        memento.boolean = this.value;
        return memento;
    }

    restore(memento: PBooleanMemento, lookup?: Map<string, object> | undefined): void {
        this.value = memento.boolean;
    }

}

class PBooleanMemento extends PropertyMemento {
    boolean: boolean | undefined;
}