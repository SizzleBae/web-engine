import { Serializable } from "./Serializable";
import { PropertyVisitor } from "./PropertyVisitor";
import { Property } from "./Property";

@Serializable('core.property.PReference')
export class PReference<T extends object> extends Property<T> {

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