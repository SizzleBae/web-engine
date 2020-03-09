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

}

class PBooleanMemento extends PropertyMemento {
    boolean: boolean = false;
}