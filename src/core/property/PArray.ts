
import { Property } from "./Property";
import { PropertyVisitor } from "./PropertyVisitor";
import { Serializable } from "./Serializable";
import { PropertyMemento } from "./PropertyMemento";

@Serializable('core.property.PArray')
export class PArray<T> extends Property<Property<T>[]> {

    copy(source: Property<Property<T>[]>): this {
        const sourceArray = source.get();
        if (sourceArray) {
            const clonedArray = sourceArray.map(sourceProperty => sourceProperty.clone());
            this.value = clonedArray;
        }
        return this;
    }

    clone(): Property<Property<T>[]> {
        return new PArray<T>(undefined).copy(this);
    }

    accept(visitor: PropertyVisitor): void {
        visitor.visitArray(this);
    }
}

class PArrayMemento extends PropertyMemento {
    array: PropertyMemento[] = [];
}