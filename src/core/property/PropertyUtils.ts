import {AbstractProperty} from "../property-new/AbstractProperty";

export class PropertyUtils {
    static forEachPropertyIn(propertyOwner: object, action: (property: AbstractProperty, key: string) => void): void {
        for (const [key, value] of Object.entries(propertyOwner)) {
            if (value instanceof AbstractProperty) {
                action(value, key);
            }
        }
    }

    static getPropertyIn(object: object, key: string): AbstractProperty | undefined {
        return (object as any)[key];
    }
}