import { PropertyStrategy } from "./PropertyStrategy";
import { Serializable } from "../property/Serializable";
import { SerializedObject } from "./SerializedObject";
import { PropertyVisitor } from "./PropertyVisitor";
import { DynamicProperty } from "./DynamicProperty";

@Serializable('core.property.StringStrategy')
export class StringStrategy implements PropertyStrategy<string> {
    accept(visitor: PropertyVisitor, property: DynamicProperty<string>): void {
        visitor.visitString(property);
    }

    serialize(value: string | undefined): SerializedObject {
        const result = new SerializedObject();
        result.data = value;
        return result;
    }

    deserialize(data: SerializedObject): string | undefined {
        return data.data;
    }
}