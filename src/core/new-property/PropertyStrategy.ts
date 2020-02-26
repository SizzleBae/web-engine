import { SerializedObject } from "./SerializedObject";
import { Property } from "./Property";
import { PropertyVisitor } from "./PropertyVisitor";

export interface PropertyStrategy<T> {
    accept(property: Property<T>, visitor: PropertyVisitor): void;
    copy(property: Property<T>, source: Property<T>): void;
    clone(property: Property<T>): Property<T>;
    // serialize(value: T | undefined, lookup: Map<object, string>): SerializedObject;
    // deserialize(data: SerializedObject, lookup: Map<string, object>): T | undefined;
}