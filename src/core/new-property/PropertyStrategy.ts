import { SerializedObject } from "./SerializedObject";
import { DynamicProperty } from "./DynamicProperty";
import { PropertyVisitor } from "./PropertyVisitor";

export interface PropertyStrategy<T> {
    accept(visitor: PropertyVisitor, property: DynamicProperty<T>): void;
    serialize(value: T | undefined, lookup: Map<object, string>): SerializedObject;
    deserialize(data: SerializedObject, lookup: Map<string, object>): T | undefined;
}