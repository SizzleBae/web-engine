import { DynamicProperty } from "./DynamicProperty";
import { PropertyStrategy } from "./PropertyStrategy";

export interface PropertyVisitor {

    visitString(property: DynamicProperty<string>, strategy: PropertyStrategy<string>): void;
    visitArray<T>(property: DynamicProperty<DynamicProperty<T>[]>, strategy: PropertyStrategy<DynamicProperty<T>[]>): void;
    visitObjectData(property: DynamicProperty<object>, strategy: PropertyStrategy<object>): void;
    visitObjectReference(property: DynamicProperty<object>, strategy: PropertyStrategy<object>): void;

}