import {Property} from "../Property";
import {ArrayProperty} from "../ArrayProperty";

export interface PropertyVisitor {
    visitProperty(property: Property<any>): void;
    visitArrayProperty(property: ArrayProperty<any>): void;
}