import { PropertyStrategy } from "./PropertyStrategy";
import { Serializable } from "../property/Serializable";
import { SerializedObject } from "./SerializedObject";
import { PropertyVisitor } from "./PropertyVisitor";
import { DynamicProperty } from "./DynamicProperty";

@Serializable('core.property.BooleanStrategy')
export class BooleanStrategy implements PropertyStrategy<boolean> {
    copy(target: DynamicProperty<boolean>): void {

    }

    accept(visitor: PropertyVisitor, property: DynamicProperty<boolean>): void {
        visitor.visitBoolean(property);
    }
}