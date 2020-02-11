import { PropertyVisitor } from "./PropertyVisitor";
import { PrimitiveProperty, primitive } from "./PrimitiveProperty";
import { ObjectProperty } from "./ObjectProperty";
import { ArrayProperty } from "./ArrayProperty";
import { DynamicProperty } from "./Property";
import { PropertyUtils } from "./PropertyUtils";

export class PropertyMerger extends PropertyVisitor {

    private writing = false;

    mergePropertyOwners(source: object, target: object): void {
        PropertyUtils.forEachPropertyIn(source, (property) => {
            property.accept(this);
        })

        this.writing = true;

        PropertyUtils.forEachPropertyIn(target, (property) => {
            property.accept(this);
        });
    }

    visitPrimitive<T extends primitive>(property: PrimitiveProperty<T>): void {

    }

    visitObject<T extends object>(property: ObjectProperty<T>): void {

    }

    visitArray<T>(property: ArrayProperty<T>): void {
        property.get()?.forEach(element => element.accept(this));
    }
}