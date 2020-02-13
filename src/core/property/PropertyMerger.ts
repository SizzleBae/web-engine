import { PropertyVisitor } from "./PropertyVisitor";
import { PrimitiveProperty, primitive } from "./PrimitiveProperty";
import { ObjectProperty } from "./ObjectProperty";
import { ArrayProperty } from "./ArrayProperty";
import { DynamicProperty } from "./Property";
import { PropertyUtils } from "./PropertyUtils";

export class PropertyMerger extends PropertyVisitor {

    private writing = false;

    private currentSourceProperty: DynamicProperty<any> | undefined;

    mergePropertyOwners(source: object, target: object): void {
        PropertyUtils.forEachPropertyIn(source, (property, key) => {

            this.mergeProperty(property, PropertyUtils.getPropertyIn(target, key));

        })

    }

    mergeProperty(source: DynamicProperty<any> | undefined, target: DynamicProperty<any> | undefined): void {
        if (source === undefined || target === undefined) {
            console.warn(`Attempted to merge incompatible properties! ${source} - ${target}`);
            return;
        }

        if (source.get() === undefined) {
            return;
        }

        if (source instanceof ArrayProperty) {
            if (target.get() === undefined) {
                target.set([]);
            }

            for (let i = 0; i < source.get().length; i++) {
                this.mergeProperty(source.get()[i], target.get()[i]);
            }
            return;
        }

        if (target.get() !== undefined) {
            return;
        }

        target.copyFrom(source);
    }

    visitPrimitive<T extends primitive>(property: PrimitiveProperty<T>): void {

    }

    visitObject<T extends object>(property: ObjectProperty<T>): void {

    }

    visitArray<T>(property: ArrayProperty<T>): void {
        property.get()?.forEach(element => element.accept(this));
    }
}