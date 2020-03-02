import { Serializable } from "./Serializable";
import { PropertyVisitor } from "./PropertyVisitor";
import { Property } from "./Property";

@Serializable('core.property.PNumber')
export class PNumber extends Property<number> {

    copy(source: Property<number>): this {
        this.value = source.get();
        return this;
    }

    clone(): Property<number> {
        return new PNumber(this.value);
    }

    accept(visitor: PropertyVisitor): void {
        visitor.visitNumber(this);
    }

}