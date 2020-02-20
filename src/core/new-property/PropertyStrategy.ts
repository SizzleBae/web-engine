import { SerializedObject } from "./SerializedObject";

export interface PropertyStrategy<T> {
    serialize(value: T | undefined, lookup: Map<object, string>): SerializedObject;
    deserialize(data: SerializedObject, lookup: Map<string, object>): T | undefined;
}