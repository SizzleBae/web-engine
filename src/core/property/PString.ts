import { Serializable } from "./Serializable";
import { PropertyVisitor } from "./PropertyVisitor";
import { Property } from "./Property";

@Serializable('core.property.PString')
export class PString extends Property<string> {

    copy(source: Property<string>): this {
        this.value = source.get();
        return this;
    }

    clone(): Property<string> {
        return new PString(this.value);
    }

    accept(visitor: PropertyVisitor): void {
        visitor.visitString(this);
    }

}