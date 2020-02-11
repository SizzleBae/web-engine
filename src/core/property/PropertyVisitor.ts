import { PrimitiveProperty, primitive } from "./PrimitiveProperty";
import { ObjectProperty } from "./ObjectProperty";
import { ArrayProperty } from "./ArrayProperty";

export abstract class PropertyVisitor {
    abstract visitPrimitive<T extends primitive>(property: PrimitiveProperty<T>): void;
    abstract visitObject<T extends object>(property: ObjectProperty<T>): void;
    abstract visitArray<T>(property: ArrayProperty<T>): void;
}