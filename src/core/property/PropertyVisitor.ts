import { DynamicProperty } from "./DynamicProperty";

export interface PropertyVisitor {

    visitString(property: DynamicProperty<string>): void;
    visitNumber(property: DynamicProperty<number>): void;
    visitBoolean(property: DynamicProperty<boolean>): void;
    visitData<T extends object>(property: DynamicProperty<T>): void;
    visitReference<T extends object>(property: DynamicProperty<T>): void;
    visitArray<T>(property: DynamicProperty<DynamicProperty<T>[]>): void;

}