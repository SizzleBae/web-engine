import { PropertyStrategy } from "./PropertyStrategy";
import { Serializable } from "../property/Serializable";
import { SerializedObject } from "./SerializedObject";
import { PropertyVisitor } from "./PropertyVisitor";
import { Property } from "./Property";

@Serializable('core.property.StringStrategy')
export class PString implements PropertyStrategy<string> {
    copy(property: Property<string>, source: Property<string>): void {
        property.set(source.get());
    }

    clone(property: Property<string>): Property<string> {
        return new Property(new PString(), property.get());
    }

    accept(property: Property<string>, visitor: PropertyVisitor): void {
        visitor.visitString(property);
    }
}