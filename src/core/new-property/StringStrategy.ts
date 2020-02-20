import { PropertyStrategy } from "./PropertyStrategy";
import { Serializable } from "../property/Serializable";
import { SerializedObject } from "./SerializedObject";

@Serializable('core.property.StringStrategy')
export class StringStrategy implements PropertyStrategy<string> {
    serialize(value: string | undefined): SerializedObject {
        const result = new SerializedObject();
        result.data = value;
        return result;
    }

    deserialize(data: SerializedObject): string | undefined {
        return data.data;
    }
}