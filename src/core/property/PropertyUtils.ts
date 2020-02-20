import { DynamicProperty } from "../new-property/DynamicProperty";

export class PropertyUtils {
    static forEachPropertyIn(propertyOwner: object, action: (property: DynamicProperty<any>, key: string) => void): void {
        for (const [key, value] of Object.entries(propertyOwner)) {
            if (value instanceof DynamicProperty) {
                action(value, key);
            }
        }
    }

    static getPropertyIn(object: object, key: string): DynamicProperty<any> | undefined {
        return (object as any)[key];
    }
}