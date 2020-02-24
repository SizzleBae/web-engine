import { PropertyStrategy } from "./PropertyStrategy";
import { Serializable } from "../property/Serializable";
import { SerializedObject } from "./SerializedObject";
import { PropertyVisitor } from "./PropertyVisitor";
import { DynamicProperty } from "./DynamicProperty";

@Serializable('core.property.BooleanStrategy')
export class BooleanStrategy implements PropertyStrategy<boolean> {

    copy(property: DynamicProperty<boolean>, source: DynamicProperty<boolean>): void {
        property.set(source.get());
    }

    clone(property: DynamicProperty<boolean>): DynamicProperty<boolean> {
        return new DynamicProperty(new BooleanStrategy(), property.get());
    }

    accept(property: DynamicProperty<boolean>, visitor: PropertyVisitor): void {
        visitor.visitBoolean(property);
    }
}