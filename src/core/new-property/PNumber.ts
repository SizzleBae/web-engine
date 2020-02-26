import { PropertyStrategy } from "./PropertyStrategy";
import { Serializable } from "../property/Serializable";
import { PropertyVisitor } from "./PropertyVisitor";
import { Property } from "./Property";

@Serializable('core.property.NumberStrategy')
export class PNumber implements PropertyStrategy<number> {

    copy(property: Property<number>, source: Property<number>): void {
        property.set(source.get());
    }

    clone(property: Property<number>): Property<number> {
        return new Property(new PNumber(), property.get());
    }

    accept(property: Property<number>, visitor: PropertyVisitor): void {
        visitor.visitNumber(property);
    }
}

