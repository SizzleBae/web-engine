import { ObjectProperty } from "./ObjectProperty";
import { DynamicProperty } from "./Property";
import { SerializeUtils } from "./SerializeUtils";
import { Primitive } from "./PrimitiveProperty";

export class ArrayProperty<T> extends ObjectProperty<T[]> {
    constructor(defaultValue: T[] | null, readonly?: boolean) {
        super(Array, defaultValue, readonly);
    }

    public serialize(): string {
        if (this.value === null) {
            return 'null';
        }

        let result = '[';

        let first = true;
        this.value.forEach(element => {
            if (!first) {
                result = result + ',';
            }

            if (typeof element === 'object') {
                result = result.concat(SerializeUtils.serializeObject(element));
            } else {
                result = result.concat(SerializeUtils.serializePrimitive(element as unknown as Primitive));
            }

            first = false;
        })

        for (const propertyKey in this.value) {
            if (Object.prototype.hasOwnProperty.call(this.value, propertyKey)) {
                const property = this.value[propertyKey];

                if (property instanceof DynamicProperty) {
                    result = result.concat(propertyKey, ':', property.serialize(), ';');
                }
            }
        }

        return result + ']';
    }

    public deserialize(value: string): void {

    }

}