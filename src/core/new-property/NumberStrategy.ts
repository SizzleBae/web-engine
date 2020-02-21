import { PropertyStrategy } from "./PropertyStrategy";
import { Serializable } from "../property/Serializable";
import { SerializedObject } from "./SerializedObject";
import { PropertyVisitor } from "./PropertyVisitor";
import { DynamicProperty } from "./DynamicProperty";

@Serializable('core.property.NumberStrategy')
export class NumberStrategy implements PropertyStrategy<number> {
    accept(visitor: PropertyVisitor, property: DynamicProperty<number>): void {
        visitor.visitNumber(property);
    }
}