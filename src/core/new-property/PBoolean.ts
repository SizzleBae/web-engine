import { PropertyStrategy } from "./PropertyStrategy";
import { Serializable } from "../property/Serializable";
import { SerializedObject } from "./SerializedObject";
import { PropertyVisitor } from "./PropertyVisitor";
import { Property } from "./Property";

@Serializable('core.property.BooleanStrategy')
export class PBoolean implements PropertyStrategy<boolean> {

    copy(property: Property<boolean>, source: Property<boolean>): void {
        property.set(source.get());
    }

    clone(property: Property<boolean>): Property<boolean> {
        return new Property(new PBoolean(), property.get());
    }

    accept(property: Property<boolean>, visitor: PropertyVisitor): void {
        visitor.visitBoolean(property);
    }
}