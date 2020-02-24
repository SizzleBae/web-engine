import { PropertyStrategy } from "./PropertyStrategy";
import { Serializable } from "../property/Serializable";
import { SerializedObject } from "./SerializedObject";
import { PropertyVisitor } from "./PropertyVisitor";
import { DynamicProperty } from "./DynamicProperty";

@Serializable('core.property.StringStrategy')
export class StringStrategy implements PropertyStrategy<string> {
    copy(property: DynamicProperty<string>, source: DynamicProperty<string>): void {
        property.set(source.get());
    }

    clone(property: DynamicProperty<string>): DynamicProperty<string> {
        return new DynamicProperty(new StringStrategy(), property.get());
    }

    accept(property: DynamicProperty<string>, visitor: PropertyVisitor): void {
        visitor.visitString(property);
    }
}