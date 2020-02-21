import { SerializedObject } from "./SerializedObject";
import { DynamicProperty } from "./DynamicProperty";
import { PropertyVisitor } from "./PropertyVisitor";

export interface PropertyStrategy<T> {
    accept(property: DynamicProperty<T>, visitor: PropertyVisitor): void;
    copy(property: DynamicProperty<T>, target: DynamicProperty<T>): void;
    // serialize(value: T | undefined, lookup: Map<object, string>): SerializedObject;
    // deserialize(data: SerializedObject, lookup: Map<string, object>): T | undefined;
}