import { Property } from "./Property";
import { PropertyStrategy } from "./PropertyStrategy";

export interface PropertyVisitor {

    visitString(property: Property<string>): void;
    visitNumber(property: Property<number>): void;
    visitBoolean(property: Property<boolean>): void;
    visitObjectData(property: Property<object>): void;
    visitObjectReference(property: Property<object>): void;
    visitArray<T>(property: Property<Property<T>[]>): void;

}