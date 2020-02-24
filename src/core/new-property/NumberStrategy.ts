import { PropertyStrategy } from "./PropertyStrategy";
import { Serializable } from "../property/Serializable";
import { SerializedObject } from "./SerializedObject";
import { PropertyVisitor } from "./PropertyVisitor";
import { DynamicProperty } from "./DynamicProperty";

@Serializable('core.property.NumberStrategy')
export class NumberStrategy implements PropertyStrategy<number> {

    copy(property: DynamicProperty<number>, source: DynamicProperty<number>): void {
        property.set(source.get());
    }

    clone(property: DynamicProperty<number>): DynamicProperty<number> {
        return new DynamicProperty(new NumberStrategy(), property.get());
    }

    accept(property: DynamicProperty<number>, visitor: PropertyVisitor): void {
        visitor.visitNumber(property);
    }
}