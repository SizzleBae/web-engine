import { Property } from "./Property";

export interface PropertyVisitor {

    visitString(property: Property<string>): void;
    visitNumber(property: Property<number>): void;
    visitBoolean(property: Property<boolean>): void;
    visitData<T extends object>(property: Property<T>): void;
    visitReference<T extends object>(property: Property<T>): void;
    visitArray<T>(property: Property<Property<T>[]>): void;

}