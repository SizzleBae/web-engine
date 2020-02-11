import { DynamicProperty } from "./Property";

export class PropertyUtils {
    static forEachPropertyIn(propertyOwner: object, action: (property: DynamicProperty<any>, key: string) => void): void {
        for (const [key, value] of Object.entries(propertyOwner)) {
            if (value instanceof DynamicProperty) {
                action(value, key);
            }
        }
    }
}