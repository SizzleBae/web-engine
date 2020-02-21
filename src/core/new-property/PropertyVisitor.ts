import { DynamicProperty } from "./DynamicProperty";
import { PropertyStrategy } from "./PropertyStrategy";

export interface PropertyVisitor {

    visitString(property: DynamicProperty<string>): void;
    visitNumber(property: DynamicProperty<number>): void;
    visitBoolean(property: DynamicProperty<boolean>): void;
    visitObjectData(property: DynamicProperty<object>): void;
    visitObjectReference(property: DynamicProperty<object>): void;
    visitArray<T>(property: DynamicProperty<DynamicProperty<T>[]>): void;

}