import { Serializable } from "./Serializable";
import { PropertyVisitor } from "./PropertyVisitor";
import { Property } from "./Property";

@Serializable('core.property.PData')
export class PData<T extends object> extends Property<T> {

    copy(source: Property<T>): this {
        this.value = source.get();
        return this;
    }

    clone(): Property<T> {
        return new PData(this.value);
    }

    accept(visitor: PropertyVisitor): void {
        visitor.visitData(this);
    }

} 