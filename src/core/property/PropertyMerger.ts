import { PropertyVisitor } from "./PropertyVisitor";
import { PrimitiveProperty, primitive } from "./PrimitiveProperty";
import { ObjectProperty } from "./ObjectProperty";
import { ArrayProperty } from "./ArrayProperty";
import { DynamicProperty } from "./Property";
import { PropertyUtils } from "./PropertyUtils";
import { isReturnStatement } from "@babel/types";

export class PropertyMerger extends PropertyVisitor {

    private currentSourceProperty: DynamicProperty<any> | undefined;

    mergePropertyOwners(source: object, target: object): void {
        PropertyUtils.forEachPropertyIn(source, (property, key) => {

            this.attemptMergeProperty(property, PropertyUtils.getPropertyIn(target, key));

        })
    }

    attemptMergeProperty(source: DynamicProperty<any> | undefined, target: DynamicProperty<any> | undefined): void {
        if (source && target) {
            this.currentSourceProperty = source;

            target.accept(this);
        }
    }

    visitPrimitive<T extends primitive>(property: PrimitiveProperty<T>): void {
        if (this.currentSourceProperty !== undefined && property.get() === undefined) {
            property.copyFrom(this.currentSourceProperty);
        }
    }

    visitObject<T extends object>(property: ObjectProperty<T>): void {
        if (this.currentSourceProperty !== undefined && property.get() === undefined) {
            property.copyFrom(this.currentSourceProperty);
        }
    }

    visitArray<T>(property: ArrayProperty<T>): void {

        const currentSourceArray = this.currentSourceProperty;
        if (currentSourceArray === undefined) {
            return;
        }

        for (let i = 0; i < currentSourceArray.get().length; i++) {
            this.attemptMergeProperty(currentSourceArray.get()?.[i], property.get()?.[i]);
        }

    }
}