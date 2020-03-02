import { Property } from "./Property";

export class PropertyUtils {
    static forEachPropertyIn(propertyOwner: object, action: (property: Property<any>, key: string) => void): void {
        for (const [key, value] of Object.entries(propertyOwner)) {
            if (value instanceof Property) {
                action(value, key);
            }
        }
    }

    static getPropertyIn(object: object, key: string): Property<any> | undefined {
        return (object as any)[key];
    }
}