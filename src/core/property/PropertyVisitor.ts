import { PrimitiveProperty, primitive } from "./PrimitiveProperty";
import { ObjectProperty } from "./ObjectProperty";
import { ArrayProperty } from "./ArrayProperty";

export interface PropertyVisitor {
    visitPrimitive<T extends primitive>(property: PrimitiveProperty<T>): void;
    visitObject<T extends object>(property: ObjectProperty<T>): void;
    visitArray<T>(property: ArrayProperty<T>): void;
}