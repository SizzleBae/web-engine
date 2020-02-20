import { PropertyVisitor } from "./PropertyVisitor";
import { primitive, PrimitiveProperty } from "./PrimitiveProperty";
import { ObjectProperty } from "./ObjectProperty";
import { ArrayProperty } from "./ArrayProperty";
import { PropertyUtils } from "./PropertyUtils";

export class PropertySearcher implements PropertyVisitor {

    entries: object[] = [];

    private predicate: (object: object) => boolean = () => true;

    /**
     * Adds objects to this search's entries.
     * 
     * Can be chained.
     * @param objects The objects to add
     */
    add(...objects: object[]): this {
        this.entries.push(...objects);
        return this;
    }

    /**
     * Goes through each current entry's properties, identifies unique objects and runs predicate test on them.
     * 
     * If predicate returns true, the object is added to entries and is also checked recursively.
     *
     * Can be chained.
     * @param predicate Decides which objects are added to entries, by default predicate always returns true, meaning that all objects found are added to entries.
     */
    find(predicate?: (object: object) => boolean): this {
        if (predicate) {
            this.predicate = predicate;
        } else {
            this.predicate = () => true;
        }

        this.entries.slice().forEach(object => {
            this.applyPredicate(object);
        });
        return this;
    }

    private applyPredicate(target: object): void {

        PropertyUtils.forEachPropertyIn(target, (property) => {
            property.accept(this);
        });

    }

    visitPrimitive<T extends primitive>(property: PrimitiveProperty<T>): void {

    }

    visitObject<T extends object>(property: ObjectProperty<T>): void {
        const object = property.get();
        if (object && !this.entries.includes(object)) {
            if (this.predicate(object)) {
                this.entries.push(object);
                this.applyPredicate(object);
            }
        }
    }

    visitArray<T>(property: ArrayProperty<T>): void {
        property.get()?.forEach(subProperty => subProperty.accept(this));
    }
}